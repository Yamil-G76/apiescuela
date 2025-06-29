# Modelo type.py
from config.db import engine, Base
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import sessionmaker
from pydantic import BaseModel


# region clases base
class UserType (Base):
   __tablename__ = "types"
   id=Column("id", Integer, primary_key=True)
   name = Column("name", String)

   def __init__(self,name):
   
      self.name =name

  
# endregion



class Imputtype(BaseModel):
   name : str



Session = sessionmaker(bind=engine)  


session = Session()