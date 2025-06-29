#Rutas/type.py
from fastapi import APIRouter , Request
from autenticacion.seguridad import Security

from fastapi import APIRouter
from models.type import session, UserType , Imputtype
from fastapi.responses import JSONResponse

usertype = APIRouter()

@usertype.post("/type/new")
def crear_type(type :Imputtype , req : Request):
   try:   
      has_access = Security.verify_token(req.headers)
      if "iat" in has_access:   
           if has_access["usuario"]["type"]=="admin":
              nuevotype=UserType(type.name)
              session.add(nuevotype)
              session.commit()
              return "type creado "
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


