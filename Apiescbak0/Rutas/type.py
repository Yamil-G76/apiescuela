from fastapi import APIRouter
from models.type import session, UserType , Imputtype
from fastapi.responses import JSONResponse

usertype = APIRouter()


@usertype.post("/type/new")
def crear_type(type :Imputtype ):
    try:
        nuevotype=UserType(type.name)
        session.add(nuevotype)
        session.commit()
        return "type creado "
    except Exception as e:
        print("error inesperado:", e)
        return JSONResponse(
           status_code=500, content={"detail": "Error al agregar type"}
       )
    finally: session.close()




