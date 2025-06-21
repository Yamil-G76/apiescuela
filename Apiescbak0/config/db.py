from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base

engine = create_engine("postgresql://postgres:123@localhost:5432/escuela0", echo=True)


Base = declarative_base()

