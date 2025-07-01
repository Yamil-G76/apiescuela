from fastapi import APIRouter , Request
from autenticacion.seguridad import Security

from models.userdetail import UserDetail
from models.usuario_carrera import session, UsuarioXcarrera , ImputUsuarioxcarrera
from fastapi.responses import JSONResponse
from sqlalchemy.orm import (
   joinedload,
)  ## muy útil para devolver el objeto user con cada uno de sus userDetail, todo junto (técnica llamada join loading: carga con unión)

usuario_carrera = APIRouter()

# region post 

@usuario_carrera.post("/usuario/carrera/new")
def crear_usuario_carrera(usuario_carrera : ImputUsuarioxcarrera,req :Request):
   try:
       has_access = Security.verify_token(req.headers)
       if "iat" in has_access:   
           if has_access["usuario"]["type"]=="admin":
              nuevousuario_carrera = UsuarioXcarrera(usuario_carrera.id_carrera,usuario_carrera.id_user)
              session.add(nuevousuario_carrera)
              session.commit()
              return "usuario_carrera creado"
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

@usuario_carrera.get("/usuario/carrera/{id_user}")
def obtener_carreras_por_usuario(id_user: int, req: Request):
    try:
        has_access = Security.verify_token(req.headers)
        if "iat" in has_access:
            if has_access["usuario"]["type"] == "admin":
                relaciones = session.query(UsuarioXcarrera).options(
                    joinedload(UsuarioXcarrera.carrera)
                ).filter(UsuarioXcarrera.id_userdetail == id_user).all()

                carreras = [
                    {"id": rel.carrera.id, "name": rel.carrera.name}
                    for rel in relaciones
                ]
                return carreras
            else:
                return JSONResponse(
                    status_code=403,
                    content="No tienes permisos",
                )
        else:
            return JSONResponse(
                status_code=401,
                content=has_access,
            )
    except Exception as ex:
        print("Error ---->> ", ex)
        return JSONResponse(
            status_code=500,
            content="Error interno",
        )
    finally:
        session.close()

@usuario_carrera.get("/usuario/carrera/all")
def obtener_usuarios_carreras(req :Request):
   try:     
        has_access = Security.verify_token(req.headers)
        if "iat" in has_access:
            if has_access["usuario"]["type"]=="admin":
                  res = session.query(UsuarioXcarrera).options(joinedload(UsuarioXcarrera.userdetail).joinedload(UserDetail.user),joinedload(UsuarioXcarrera.carrera)).all()
                  print(res)
                  usuarioscarreras= [] 

                  for r in res: 
                     username = r.userdetail.user[0].username
                     nombre_carrera = r.carrera.name
                     usuarioscarreras.append({
                        "username":username,
                        "carrera":nombre_carrera
                     })
                  return usuarioscarreras
            else:
               return JSONResponse(
               status_code=403,
               content="no tienes permisos",
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


# endregion






