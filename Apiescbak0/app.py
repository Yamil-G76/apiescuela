import sys  # Importamos el módulo sys, que permite interactuar con el sistema y configurar el entorno de Python
sys.tracebacklimit = 1  # Limitamos la cantidad de líneas que se muestran en el traceback

from fastapi import FastAPI

from Rutas.users import user
from Rutas.career import career
from Rutas.payment import payment
from Rutas.type import usertype


from fastapi.middleware.cors import CORSMiddleware
apiescu = FastAPI () 


apiescu.include_router(usertype)
apiescu.include_router(career)
apiescu.include_router(payment)
apiescu.include_router(user)
apiescu.add_middleware(
   CORSMiddleware,
   allow_origins=["*"],
   allow_credentials = True,
   allow_methods=["GET", "POST", "PUT", "DELETE"],
   allow_headers=["*"],
)


