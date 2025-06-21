
from config.db import engine, Base
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import sessionmaker, relationship


   

# region clases base
class UserDetail(Base):

   __tablename__ = "userdetails"


   id = Column("id", Integer, primary_key=True)
   dni = Column("dni", Integer)
   firstname = Column("firstname", String)
   lastname = Column("lastname", String)
   email = Column("email", String(80), nullable=False, unique=True)
   id_type = Column("id_type", Integer ,  ForeignKey("types.id"))


   usertype= relationship("UserType", uselist=False, backref="userdetail")
   usuario_carrera=relationship("UsuarioXcarrera",uselist=True, back_populates="userdetail")



   def __init__(self, dni, firstname, lastname, email,id_type):
       self.dni = dni
       self.firstname = firstname
       self.lastname = lastname
       self.email=email
       self.id_type =id_type

  
# endregion
Base.metadata.create_all(bind=engine)

Session = sessionmaker(bind=engine)  


session = Session()
