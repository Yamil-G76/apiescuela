# Modelo career.py
from config.db import engine, Base
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import sessionmaker, relationship
from pydantic import BaseModel
import datetime

# region clases base
class Career (Base): 
    __tablename__= "carreras"
    id = Column("id", Integer, primary_key=True)
    name = Column("name",String(50) )
    costo_mensual = Column("costo_mensual" , Integer) 
    duracion_meses = Column("duracion_meses" , Integer) 
    inicio_cursado = Column("inicio_cursado" , DateTime)
    usuariosxcarrera = relationship("UsuarioXcarrera",back_populates="carrera")

    def __init__(self,name,costo_mensual,duracion_meses, inicio_cursado): 
     self.name = name
     self.costo_mensual= costo_mensual
     self.duracion_meses = duracion_meses
     self.inicio_cursado = inicio_cursado
  
# endregion



class Imputcareer(BaseModel):
   name :str
   costo_mensual : int
   duracion_meses : int
   inicio_cursado :datetime.date





Session = sessionmaker(bind=engine)  


session = Session()

