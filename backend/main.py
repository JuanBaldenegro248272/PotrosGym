from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

app = FastAPI(title="PotroGym API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Alumno(BaseModel):
    id: str
    nombre: str
    huellaID: int
    estado: str = "Activo"
    fechaRegistro: Optional[str] = None

class Acceso(BaseModel):
    huellaID: int
    timestamp: Optional[str] = None

db_alumnos = [
    {"id": "2024001", "nombre": "Juan Rascon", "huellaID": 1, "estado": "Activo", "fechaRegistro": "2024-05-01"},
]
db_accesos = []

@app.get("/alumnos", response_model=List[Alumno])
async def get_alumnos():
    return db_alumnos

@app.post("/alumnos")
async def crear_alumno(alumno: Alumno):
    alumno.fechaRegistro = datetime.now().strftime("%Y-%m-%d")
    db_alumnos.append(alumno.dict())
    return {"message": "Alumno registrado con éxito", "alumno": alumno}

@app.get("/dashboard/stats")
async def get_stats():
    return {
        "total_alumnos": len(db_alumnos),
        "accesos_hoy": len([a for a in db_accesos if a['timestamp'].startswith(datetime.now().strftime("%Y-%m-%d"))]),
        "activos": len([a for a in db_alumnos if a['estado'] == "Activo"])
    }

@app.post("/esp32/acceso")
async def registrar_acceso(acceso: Acceso):
    alumno = next((a for a in db_alumnos if a["huellaID"] == acceso.huellaID), None)
    
    if not alumno:
        raise HTTPException(status_code=404, detail="Huella no reconocida")
    
    nuevo_acceso = {
        "huellaID": acceso.huellaID,
        "nombre": alumno["nombre"],
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    db_accesos.append(nuevo_acceso)
    
    print(f"¡Acceso concedido a: {alumno['nombre']}!")
    return {"status": "success", "message": f"Bienvenido {alumno['nombre']}"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)