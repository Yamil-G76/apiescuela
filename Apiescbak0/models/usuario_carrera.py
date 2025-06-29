# Modelo usuario_carrera.py
from config.db import engine, Base
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import sessionmaker, relationship
from pydantic import BaseModel, EmailStr
import datetime



class UsuarioXcarrera (Base):
   __tablename__="usuarioxcarrera"
   id = Column("id", Integer, primary_key=True)
   id_userdetail = Column("id_userdetail", Integer ,  ForeignKey("userdetails.id"))
   id_carrera = Column("id_carrera", Integer ,  ForeignKey("carreras.id"))
 

   userdetail=relationship("UserDetail", uselist=False, back_populates="usuario_carrera")
   carrera = relationship("Career",uselist=False, back_populates="usuariosxcarrera")
   payment =relationship("Payment" , back_populates="usuarioxcarrera")

   def __init__(self,id_carrera,id_userdetail =None):
      self.id_carrera = id_carrera    
      if id_userdetail:
       self.id_userdetail = id_userdetail

  
# endregion


class ImputUsuarioxcarrera(BaseModel):
   id_user : int
   id_carrera: int




Session = sessionmaker(bind=engine)  


session = Session()