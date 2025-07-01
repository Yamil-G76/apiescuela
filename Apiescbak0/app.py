import sys  # Importamos el módulo sys, que permite interactuar con el sistema y configurar el entorno de Python
sys.tracebacklimit = 1  # Limitamos la cantidad de líneas que se muestran en el traceback

from fastapi import FastAPI

from Rutas.usuario_carrera import usuario_carrera
from Rutas.users import user
from Rutas.career import career
from Rutas.payment import payment
from Rutas.type import usertype


from fastapi.middleware.cors import CORSMiddleware
apiescu = FastAPI () 

origins =["http://localhost:5173", "https://127.0.0.1:5173"]
apiescu.include_router(usertype)
apiescu.include_router(career)
apiescu.include_router(payment)
apiescu.include_router(user)
apiescu.include_router(usuario_carrera)
apiescu.add_middleware(
   CORSMiddleware,
   allow_origins=["*"],
   allow_credentials = True,
   allow_methods=["*"],
   allow_headers=["*"],
)


