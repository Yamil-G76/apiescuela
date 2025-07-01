#Rutas/users.py

from fastapi import APIRouter , Request
from autenticacion.seguridad import Security
from models.userdetail import Session as Detailsession
from models.user import Session as Usersession
from models.user import session, InputUser, User , InputLogin  
from models.userdetail import session, UserDetail
from models.usuario_carrera import session, UsuarioXcarrera 
from fastapi.responses import JSONResponse
from psycopg2 import IntegrityError
from sqlalchemy.orm import (
   joinedload,
)  ## muy útil para devolver el objeto user con cada uno de sus userDetail, todo junto (técnica llamada join loading: carga con unión)

user = APIRouter()
# region login

@user.post("/users/login")
def login_user(us: InputLogin):
   try:
      user = session.query(User).options(
      joinedload(User.userdetail).joinedload(UserDetail.usertype),
      ).filter(User.username == us.username).first()
      if user and user.password == us.password:
          usuario = {
          "idusuario": user.id,
          "usuario": user.username,
          "type": user.userdetail.usertype.name,
          }
          authDat = Security.generate_token(usuario)
          if not authDat:
             return JSONResponse(
              status_code=401,      
                content={ 
                   "success": False,
                   "message": "Error de generación de token!",
               },
               )
          else:
              return JSONResponse(
               status_code=200, content={"success": True, "token": authDat}
               )
      else:
           return JSONResponse(
               status_code=401,
               content={
                   "success": False,
                   "message": "Usuario y/o password incorrectos!",
               },
           )
   except Exception as ex:
       print("Error ---->> ", ex)
   finally:
       session.close()
# endregion
# region new 



@user.post("/user/new")
def crear_usuario(user: InputUser, req : Request):
   try:
    has_access = Security.verify_token(req.headers)
    if "iat" in has_access:
            if has_access["usuario"]["type"]=="admin":
                   # Si el usuario cumple con la validación, y no hay errores, lo agregamos.
                if validate_username(user.username): 
                    if validate_email(user.email):            
                       usuNuevo = User(user.username, user.password)
                       usuDetailNuevo = UserDetail (user.dni,user.firstname,user.lastname,user.email,user.type)           
                       usuNuevo.userdetail=usuDetailNuevo
                       session.add(usuNuevo)
                       session.commit()
            
                       return "usuario agregado"
                    else:
                       return"el mail ya existe"
                else:
                  return "el usuario ya existe"
            else:
              return JSONResponse(
               status_code=403,
               content="no tienes permisos ",
            )
    else:
       return JSONResponse(
           status_code=401,
           content=has_access,
        )  
                        
   except Exception as e:
       print("Error inesperado:", e)
       return JSONResponse(
           status_code=500, content={"detail": "Error al agregar usuario"}
       )
   finally: session.close()


  
# endregion
# region get 
   
   
@user.get("/user/me")
def info_usuario(req : Request) :
    try:     
        has_access = Security.verify_token(req.headers)

        if "iat" in has_access:
         if has_access["usuario"]["type"]=="Alumno":
                id_usuario= has_access["usuario"]["idusuario"]
                user = session.query(User).options(
                joinedload(User.userdetail).joinedload(UserDetail.usertype),
                joinedload(User.userdetail).joinedload(UserDetail.usuario_carrera).joinedload(UsuarioXcarrera.carrera)).filter(User.id == id_usuario).first()
                datos_usuario = {
                "usuario": user.username,
                "firstname": user.userdetail.firstname,
                "dni": user.userdetail.dni,
                "lastname": user.userdetail.lastname,
                "email": user.userdetail.email,
                "carreras": [rel.carrera.name for rel in user.userdetail.usuario_carrera]}              
                return datos_usuario
         if has_access["usuario"]["type"]=="admin":
                id_usuario= has_access["usuario"]["idusuario"]
                user = session.query(User).options(
                joinedload(User.userdetail)).filter(User.id == id_usuario).first()
                datos_usuario = {
                "usuario": user.username,
                "firstname": user.userdetail.firstname,
                "dni": user.userdetail.dni,
                "lastname": user.userdetail.lastname,
                "email": user.userdetail.email,
                }
                return datos_usuario
         else:
               return JSONResponse(
              status_code=403,
              content="no tienes permisos ",
               )
        else:
           return JSONResponse(
            status_code=401,
            content=has_access,
        )  
    except Exception as ex:
       print("Error ---->> ", ex)
    finally:
       session.close()

@user.get("/users/all")
def obtener_alumnos(req: Request):
    try:
        has_access = Security.verify_token(req.headers)

        if "iat" in has_access:
            if has_access["usuario"]["type"] == "admin":
                alumnos = (
                    session.query(User).join(User.userdetail).options(joinedload(User.userdetail)).filter(UserDetail.id_type == 2).all()
                )
                return alumnos
            else:
                return JSONResponse(status_code=403, content="No tienes permisos")
        else:
            return JSONResponse(status_code=401, content=has_access)

    except Exception as ex:
        print("Error ---->> ", ex)
        return JSONResponse(status_code=500, content="Error interno")

    finally:
        session.close()
# endregion


# region put

    
# endregion

# region funciones

def validate_username(value):
   s = Usersession()
   existing_user = s.query(User).filter(User.username == value).first()
   s.close()
   if existing_user:
       return None
       ##raise ValueError("Username already exists")
   else:
       return value
   

def validate_email(value):
   s1= Detailsession()
   existing_email = s1.query(UserDetail).filter(UserDetail.email == value).first()
   s1.close()
   if existing_email:
       ##raise ValueError("Username already exists")
       return None
   else:
       return value
   


# endregion




      
     
           