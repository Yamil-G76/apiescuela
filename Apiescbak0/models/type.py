
from config.db import engine, Base
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import sessionmaker, relationship
from pydantic import BaseModel, EmailStr
import datetime

# region clases base
class UserType (Base):
   __tablename__ = "types"
   id=Column("id", Integer, primary_key=True)
   name = Column("type", String)

   def __init__(self,name):
   
      self.name =name

  
# endregion



class Imputtype(BaseModel):
   name : str


Base.metadata.create_all(bind=engine)

Session = sessionmaker(bind=engine)  


session = Session()