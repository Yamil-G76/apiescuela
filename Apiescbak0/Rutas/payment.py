#Rutas/payment.py

from fastapi import APIRouter , Request
from autenticacion.seguridad import Security

from fastapi import APIRouter
from models.usuario_carrera import UsuarioXcarrera
from models.payment import session, Payment,ImputPayment, Session 
from fastapi.responses import JSONResponse
from sqlalchemy.orm import (
   joinedload,
)  ## muy útil para devolver el objeto user con cada uno de sus userDetail, todo junto (técnica llamada join loading: carga con unión)

payment = APIRouter()

# region post


@payment.post("/payments/new")
def confeccionar_pago (payment: ImputPayment,  req : Request):
   try:   
      has_access = Security.verify_token(req.headers)
      if "iat" in has_access:   
           if has_access["usuario"]["type"]=="admin":
              paynew= Payment(payment.id_usuarioxcarrera, payment.amount, payment.cuota_afectada)
              session.add(paynew)
              session.commit()
              return "pago realizado"
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

@payment.get("/payments/byrelacion/{id_usuarioxcarrera}")
def pagos_por_relacion(id_usuarioxcarrera: int, req: Request):
    session1 = Session()

    try:
        has_access = Security.verify_token(req.headers)
        if "iat" in has_access:
            if has_access["usuario"]["type"] == "admin":
                pagos = session1.query(Payment).filter(Payment.id_usuarioxcarrera == id_usuarioxcarrera).all()
                return [
                    {
                        "id": p.id,
                        "cuota_afectada": p.cuota_afectada,
                        "amount": p.amount,
                        "fecha": p.created_at.strftime("%Y-%m-%d"),
                    }
                    for p in pagos
                ]
            else:
                return JSONResponse(status_code=403, content="No autorizado")
        else:
            return JSONResponse(status_code=401, content=has_access)
    except Exception as e:
        print("Error:", e)
        return JSONResponse(status_code=500, content="Error interno")
    finally:
        session1.close()

@payment.get("/payment/all") 
def obtener_pagos(req : Request) : 
   try:     
        has_access = Security.verify_token(req.headers)
        if "iat" in has_access:
            if has_access["usuario"]["type"]=="admin":
                  res = session.query(Payment).all()
                  return res 
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

@payment.get("/payment/me")
def pagos_me(req : Request) :
    try:     
        has_access = Security.verify_token(req.headers)
        if "iat" in has_access:
            if has_access["usuario"]["type"]=="Alumno":
                id_usuario= has_access["usuario"]["idusuario"]
                UsuarioXcarrera_payment = session.query(UsuarioXcarrera).options(joinedload(UsuarioXcarrera.payment), joinedload(UsuarioXcarrera.carrera)).filter(UsuarioXcarrera.id_userdetail == id_usuario).all()
                pagos_alumno= []  
                for rel in UsuarioXcarrera_payment: 
                    for pago in rel.payment:
                        pagos_alumno.append({
                        "amount": pago.amount,
                        "fecha del pago": pago.created_at.isoformat(),
                        "cuota numero": pago.cuota_afectada,
                        "carrera": rel.carrera.name 
                        })     
                return pagos_alumno          
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