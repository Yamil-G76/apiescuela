
from config.db import engine, Base
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import sessionmaker, relationship
from pydantic import BaseModel, EmailStr
import datetime

# region clases base

 
class User(Base):
   __tablename__ = "usuarios"

   id = Column("id", Integer, primary_key=True)
   username = Column("username", String(50),nullable=False, unique=True )
   password = Column("password", String)
   id_userdetail = Column("id_userdetail", Integer, ForeignKey("userdetails.id"))
 
   userdetail = relationship("UserDetail", backref="user", uselist=False)

   
 
   def __init__(self, username, password):
       self.username = username
       self.password = password


# endregion

# region session
Base.metadata.create_all(bind=engine)

Session = sessionmaker(bind=engine)  


session = Session()

# endregion

# region Basemodel 



class InputUser(BaseModel):
   username: str
   password: str
   email: EmailStr
   dni: int
   firstname: str
   lastname: str
   type :int
   id_carrera: int

   
class InputLogin(BaseModel):
    username: str
    password: str




# endregion


   