# Modelo paymen.py
from config.db import engine, Base
from sqlalchemy import Column, Integer,  ForeignKey, DateTime
from sqlalchemy.orm import sessionmaker, relationship
from pydantic import BaseModel
import datetime

# region clases base
class Payment (Base) :
   
   __tablename__ ="pagos"

   id = Column("id", Integer, primary_key=True)
   id_usuarioxcarrera = Column ("id_usuarioxcarrera" , Integer , ForeignKey("usuarioxcarrera.id"))
   amount = Column("amount", Integer)
   cuota_afectada = Column("cuota_afectada", Integer)
   created_at = Column("created_at", DateTime ,default=datetime.datetime.now() )

   usuarioxcarrera=relationship("UsuarioXcarrera" , back_populates="payment")

   def __init__(self,id_usuarioxcarrera,amount,cuota_afectada):
     self.id_usuarioxcarrera = id_usuarioxcarrera
     self.amount= amount
     self.cuota_afectada = cuota_afectada

      
# endregion



class ImputPayment(BaseModel):
   id_usuarioxcarrera :int
   amount :int
   cuota_afectada:int


Session = sessionmaker(bind=engine)  


session = Session()