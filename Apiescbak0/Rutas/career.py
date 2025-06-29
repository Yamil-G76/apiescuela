# Rutas/career.py le falta aplicar la seguridad del token pero lo paso x si hay sujerencias

from fastapi import APIRouter , Request
from autenticacion.seguridad import Security

from fastapi import APIRouter
from models.career import session , Career , Imputcareer 
from fastapi.responses import JSONResponse


career = APIRouter()


@career.post("/Career/new")
def crear_Career (carerr: Imputcareer, req : Request):
   try:   
      has_access = Security.verify_token(req.headers)
      if "iat" in has_access:   
           if has_access["usuario"]["type"]=="admin":
              careernueva = Career(carerr.name, carerr.costo_mensual, carerr.duracion_meses,carerr.inicio_cursado )
              session.add(careernueva)
              session.commit()
              return "carrera creada"
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


@career.get("/career/all")
def obtener_career(req: Request):
   try:
       has_access = Security.verify_token(req.headers)
   
       if "iat" in has_access:
            if has_access["usuario"]["type"]=="admin":
              res = session.query(Career).all()
              return res
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



 