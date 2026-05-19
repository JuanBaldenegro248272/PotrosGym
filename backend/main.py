from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
import mysql.connector

app = FastAPI(title="PotroGym API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

registro_pendiente = {"id": None, "activo": False}

def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="Elmataperros1",
        database="PotroGym"
    )

class Alumno(BaseModel):
    nombre: str
    huellaID: int
    estado: int = 1

class AccesoRequest(BaseModel):
    huellaID: int

class AnuncioRequest(BaseModel):
    texto: str
    icono: str = "alerta"

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS Anuncio (
            id INT PRIMARY KEY AUTO_INCREMENT,
            texto TEXT NOT NULL,
            icono VARCHAR(30) NOT NULL DEFAULT 'alerta'
        )
    """)
    try:
        cursor.execute("ALTER TABLE Anuncio ADD COLUMN icono VARCHAR(30) NOT NULL DEFAULT 'alerta'")
    except mysql.connector.Error:
        pass
    conn.commit()
    cursor.close()
    conn.close()

init_db()

@app.get("/alumnos")
async def get_alumnos():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM PersonaGym")
    alumnos = cursor.fetchall()
    cursor.close()
    conn.close()
    return alumnos

@app.post("/alumnos")
async def crear_alumno(alumno: Alumno):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        query = "INSERT INTO PersonaGym (nombre, huellaID, estado) VALUES (%s, %s, %s)"
        cursor.execute(query, (alumno.nombre, alumno.huellaID, alumno.estado))
        conn.commit()
        return {"message": "Alumno registrado"}
    except mysql.connector.Error as err:
        raise HTTPException(status_code=400, detail=str(err))
    finally:
        cursor.close()
        conn.close()

@app.post("/esp32/acceso")
async def registrar_acceso(acceso: AccesoRequest):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT id, nombre FROM PersonaGym WHERE huellaID = %s", (acceso.huellaID,))
    persona = cursor.fetchone()
    if not persona:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=404, detail="Error")
    query = "INSERT INTO Acceso (persona_id, fecha_hora) VALUES (%s, %s)"
    cursor.execute(query, (persona['id'], datetime.now()))
    conn.commit()
    res = {"status": "success", "nombre": persona['nombre']}
    cursor.close()
    conn.close()
    return res

@app.get("/accesos")
async def get_accesos():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT
            a.id,
            p.nombre,
            p.huellaID,
            a.fecha_hora
        FROM Acceso a
        INNER JOIN PersonaGym p ON p.id = a.persona_id
        ORDER BY a.fecha_hora DESC
        LIMIT 100
    """)
    accesos = cursor.fetchall()
    cursor.close()
    conn.close()

    return [
        {
            "id": acceso["id"],
            "nombre": acceso["nombre"],
            "huellaID": acceso["huellaID"],
            "tipoUsuario": "Alumno",
            "fechaHora": acceso["fecha_hora"].strftime("%Y-%m-%d %H:%M:%S"),
            "estado": "Registrado",
        }
        for acceso in accesos
    ]

@app.get("/dashboard")
async def get_dashboard():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT COUNT(*) AS total FROM Acceso WHERE DATE(fecha_hora) = CURDATE()")
    accesos_hoy = cursor.fetchone()["total"]

    cursor.execute("SELECT COUNT(*) AS total FROM PersonaGym WHERE estado = 1")
    alumnos_activos = cursor.fetchone()["total"]

    cursor.execute("SELECT id, texto, icono FROM Anuncio ORDER BY id DESC LIMIT 3")
    anuncios = cursor.fetchall()

    cursor.execute("""
        SELECT
            a.id,
            p.nombre,
            a.fecha_hora
        FROM Acceso a
        INNER JOIN PersonaGym p ON p.id = a.persona_id
        ORDER BY a.fecha_hora DESC
        LIMIT 5
    """)
    accesos_recientes = cursor.fetchall()

    cursor.close()
    conn.close()

    return {
        "accesosHoy": accesos_hoy,
        "alumnosActivos": alumnos_activos,
        "anuncios": anuncios,
        "accesosRecientes": [
            {
                "id": acceso["id"],
                "nombre": acceso["nombre"],
                "fechaHora": acceso["fecha_hora"].strftime("%Y-%m-%d %H:%M:%S"),
            }
            for acceso in accesos_recientes
        ],
    }

@app.get("/esp32/anuncios")
async def get_anuncios_esp32():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT texto FROM Anuncio")
    anuncios = [row[0] for row in cursor.fetchall()]
    cursor.close()
    conn.close()
    return {"anuncios": anuncios}

@app.get("/anuncios")
async def get_anuncios():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT id, texto, icono FROM Anuncio ORDER BY id DESC")
    anuncios = cursor.fetchall()
    cursor.close()
    conn.close()
    return {"anuncios": anuncios}

@app.post("/anuncios")
async def agregar_anuncio(anuncio: AnuncioRequest):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO Anuncio (texto, icono) VALUES (%s, %s)",
        (anuncio.texto, anuncio.icono),
    )
    conn.commit()
    cursor.close()
    conn.close()
    return {"message": "ok"}

@app.delete("/anuncios/{id}")
async def borrar_anuncio(id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM Anuncio WHERE id = %s", (id,))
    conn.commit()
    cursor.close()
    conn.close()
    return {"message": "ok"}

@app.post("/esp32/enroll/{id}")
async def start_enroll(id: int):
    global registro_pendiente
    registro_pendiente = {"id": id, "activo": True}
    return {"message": "Iniciando escaneo"}

@app.get("/esp32/status")
async def check_status():
    return registro_pendiente

@app.post("/esp32/enroll_complete")
async def complete_enroll():
    global registro_pendiente
    registro_pendiente = {"id": None, "activo": False}
    return {"message": "Registro completado"}

@app.post("/esp32/enroll_cancel")
async def cancel_enroll():
    global registro_pendiente
    registro_pendiente = {"id": None, "activo": False}
    return {"message": "Registro cancelado"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
