from fastapi import APIRouter

from models.career import session , Career , Imputcareer 


from fastapi.responses import JSONResponse
from psycopg2 import IntegrityError


career = APIRouter()




@career.post("/Careers/new")
def crear_Career (carerr: Imputcareer):
    try:
        careernueva = Career(carerr.name, carerr.costo_mensual, carerr.duracion_meses,carerr.inicio_cursado )
        session.add(careernueva)
        session.commit()
        return "carrera creada"
    except  Exception as e:
       print("Error inesperado:", e)
       return JSONResponse(
           status_code=500, content={"detail": "Error al agregar usuario"}
       )
    finally: session.close()
    


@career.get("/career/all") 
def obtener_career() : 
    try:      
       res = session.query(Career).all
       return res
    except  Exception as e:
       print("Error inesperado:", e)
       return JSONResponse(
           status_code=500, content={"detail": "Error al agregar usuario"}
       )
    finally: session.close()
 