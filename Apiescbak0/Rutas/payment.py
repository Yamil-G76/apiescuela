from fastapi import APIRouter
from models.payment import session, Payment,ImputPayment 
from fastapi.responses import JSONResponse

payment = APIRouter()


@payment.post("/payments/new")
def confeccionar_pago (payment: ImputPayment):
    try:
        paynew= Payment(payment.id_usuarioxcarrera, payment.amount, payment.cuota_afectada)
        session.add(paynew)
        session.commit()
        return "pago realizado"
    except  Exception as e:
       print("Error inesperado:", e)
       return JSONResponse(
           status_code=500, content={"detail": "Error al agregar usuario"}
       )
    finally: session.close()


@payment.get("/payment/all") 
def obtener_pagos() : 
    try:      
       res = session.query(Payment).all()
       return res
    except  Exception as e:
       print("Error inesperado:", e)
       return JSONResponse(
           status_code=500, content={"detail": "Error al agregar usuario"}
       )
    finally: session.close() 