from fastapi import APIRouter , Request
from autenticacion.seguridad import Security

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
      joinedload(User.userdetail).joinedload(UserDetail.usuario_carrera).joinedload(UsuarioXcarrera.carrera)
      ).filter(User.username == us.username).first()
      if user and user.password == us.password:
          datos_usuario = {
          "idUsuario": user.id,
          "usuario": user.username,
          "firstname": user.userdetail.firstname,
          "dni": user.userdetail.dni,
          "lastname": user.userdetail.lastname,
          "email": user.userdetail.email,
          "type": user.userdetail.usertype.name,
          "carreras": [rel.carrera.name for rel in user.userdetail.usuario_carrera]
          }
          authDat = Security.generate_token(datos_usuario)
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
def crear_usuario(user: InputUser):
   try:
       # Si el usuario cumple con la validación, y no hay errores, lo agregamos.
       if validate_username(user.username): 
           if validate_email(user.email):            
             usuNuevo = User(user.username, user.password)
             usuDetailNuevo = UserDetail (user.dni,user.firstname,user.lastname,user.email,user.type)             
             usuarioxcarreranuevo = UsuarioXcarrera(user.id_carrera )

             usuDetailNuevo.usuario_carrera.append(usuarioxcarreranuevo)
             usuNuevo.userdetail=usuDetailNuevo
             session.add(usuNuevo)
             session.commit()
            
             return "usuario agregado"
           else:
               return"el mail ya existe"
       else:
           return "el usuario ya existe"
   except IntegrityError as e:  
       # Suponiendo que el mje de error contiene "username" para el campo duplicado
       if "username" in str(e):
           return JSONResponse(
               status_code=400, content={"detail": "Username ya existe"}
           )
       else:
           # Maneja otros errores de integridad
           print("Error de integridad inesperado:", e)
           return JSONResponse(
               status_code=500, content={"detail": "Error al agregar usuario"}
           )                        
   except Exception as e:
       print("Error inesperado:", e)
       return JSONResponse(
           status_code=500, content={"detail": "Error al agregar usuario"}
       )
   finally: session.close()

   

@user.get("/users/all")
def obtener_usuarios2(req: Request):
   has_access = Security.verify_token(req.headers)
   if "iat" in has_access:
       usuarios = session.query(User).all()
       return usuarios
   else:
       return JSONResponse(
           status_code=401,
           content=has_access,
       )





@user.get("/users_details/all")
def obtener_usuarios():
   try:
      return obtener_usuarios1()

   except Exception as e:
       print("Error al obtener usuarios:", e)
       return JSONResponse(
           status_code=500, content={"detail": "Error al obtener usuarios"}
       )
   


# endregion

# region put
"""


"""
    
# endregion

# region funciones

def validate_username(value):
   existing_user = session.query(User).filter(User.username == value).first()
   session.close()
   if existing_user:
       return None
       ##raise ValueError("Username already exists")
   else:
       return value
   

def validate_email(value):
   existing_email = session.query(UserDetail).filter(UserDetail.email == value).first()
   session.close()
   if existing_email:
       ##raise ValueError("Username already exists")
       return None
   else:
       return value
   

def obtener_usuarios1():
    try:
        usuarios = session.query(User).options(joinedload(User.Userdetail)).all()
        print(len(usuarios))
        usuarios_con_detalles = []
        for usuario in usuarios:
            usuario_con_detalle = {
                "id": usuario.id,
                "username": usuario.username,
                "email": usuario.Userdetail.email,
                "dni": usuario.Userdetail.dni,
                "firstname": usuario.Userdetail.firstname,
                "lastname": usuario.Userdetail.lastname,
                "type": usuario.Userdetail.type,
                "password": usuario.password
            }
            usuarios_con_detalles.append(usuario_con_detalle)
        
        return JSONResponse(status_code=200, content=usuarios_con_detalles)

    except Exception as e:
        print("Error al obtener usuarios:", e)
        return JSONResponse(
            status_code=500, content={"detail": "Error al obtener usuarios"}
        )
# endregion




      
     
           