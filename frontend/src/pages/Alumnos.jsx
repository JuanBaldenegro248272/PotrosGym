import React, { useState, useEffect } from 'react';
import { UserPlus, Search, Fingerprint, UserCheck, UserX, Pencil, Trash2, Eye } from 'lucide-react';

const API_URL = "http://localhost:8000";

const Alumnos = () => {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [alumnos, setAlumnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [escaneando, setEscaneando] = useState(false);
  const [huellaRegistrada, setHuellaRegistrada] = useState(false);

  const [nuevoAlumno, setNuevoAlumno] = useState({
    nombre: '',
    id: '',
    estado: 'Activo',
    huellaID: Math.floor(Math.random() * 100)
  });

  const fetchAlumnos = async () => {
    try {
      const response = await fetch(`${API_URL}/alumnos`);
      const data = await response.json();
      setAlumnos(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlumnos();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoAlumno({ ...nuevoAlumno, [name]: value });
  };

  const cancelarEscaneo = async () => {
    setEscaneando(false);
    setHuellaRegistrada(false);
    try {
      await fetch(`${API_URL}/esp32/enroll_cancel`, { method: 'POST' });
    } catch (error) {
      console.error(error);
    }
  };

  const toggleFormulario = async () => {
    if (mostrarFormulario) {
      await cancelarEscaneo();
      setMostrarFormulario(false);
      return;
    }

    await cancelarEscaneo();
    setMostrarFormulario(true);
  };

  const iniciarEscaneo = async () => {
    setEscaneando(true);
    setHuellaRegistrada(false);
    try {
      const response = await fetch(`${API_URL}/esp32/enroll/${nuevoAlumno.huellaID}`, { method: 'POST' });
      if (!response.ok) {
        setEscaneando(false);
      }
    } catch (error) {
      console.error(error);
      setEscaneando(false);
    }
  };

  useEffect(() => {
    if (!escaneando) return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch(`${API_URL}/esp32/status`);
        const data = await response.json();

        if (data.activo === false) {
          setEscaneando(false);
          setHuellaRegistrada(true);
        }
      } catch (error) {
        console.error(error);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [escaneando]);

  const guardarAlumno = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/alumnos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nuevoAlumno.nombre,
          huellaID: Number(nuevoAlumno.huellaID),
          estado: 1
        })
      });
      if (response.ok) {
        setMostrarFormulario(false);
        setNuevoAlumno({ nombre: '', id: '', estado: 'Activo', huellaID: Math.floor(Math.random() * 100) });
        setEscaneando(false);
        setHuellaRegistrada(false);
        fetchAlumnos();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const eliminarAlumno = async (id) => {
    if (window.confirm("¿Eliminar alumno?")) {
      setAlumnos(alumnos.filter(a => a.id !== id));
    }
  };

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="page-title">Gestión de Alumnos</h1>
        <button className="btn-primary" onClick={toggleFormulario}>
          <UserPlus size={20} /> {mostrarFormulario ? 'Cancelar' : 'Nuevo Registro'}
        </button>
      </div>

      {mostrarFormulario && (
        <div className="card" style={{ padding: '2rem', textAlign: 'left' }}>
          <form onSubmit={guardarAlumno} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label>Nombre Completo</label>
              <input name="nombre" value={nuevoAlumno.nombre} onChange={handleInputChange} type="text" required />
            </div>
            <div>
              <label>ID / Matrícula</label>
              <input name="id" value={nuevoAlumno.id} onChange={handleInputChange} type="text" required />
            </div>
            <div>
              <label>Captura de Huella (ID: {nuevoAlumno.huellaID})</label>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', border: '1px dashed blue', padding: '10px' }}>
                <Fingerprint size={32} />
                <button type="button" className="btn-primary" onClick={iniciarEscaneo} disabled={escaneando}>
                  {escaneando ? 'Escaneando...' : huellaRegistrada ? 'Huella Lista' : 'Iniciar Escaneo'}
                </button>
                {huellaRegistrada && <span style={{ color: 'green', fontWeight: 700 }}>Registro completado</span>}
              </div>
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <button type="submit" className="btn-primary">Guardar Alumno</button>
            </div>
          </form>
        </div>
      )}

      <div className="card" style={{ padding: 0 }}>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Huella ID</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {alumnos.map((alumno) => (
              <tr key={alumno.id}>
                <td>{alumno.id}</td>
                <td>{alumno.nombre}</td>
                <td>{alumno.huellaID}</td>
                <td>
                  <button onClick={() => eliminarAlumno(alumno.id)}><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Alumnos;
