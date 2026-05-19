import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AlertTriangle, Calendar, ClipboardList } from 'lucide-react';

const API_URL = 'http://localhost:8000';

const opcionesIcono = [
  { valor: 'alerta', texto: 'Alerta', Icono: AlertTriangle },
  { valor: 'calendario', texto: 'Calendario', Icono: Calendar },
  { valor: 'lista', texto: 'Lista', Icono: ClipboardList },
];

const obtenerIcono = (valor) => {
  return opcionesIcono.find((opcion) => opcion.valor === valor) || opcionesIcono[0];
};

const Anuncios = () => {
  const [anuncios, setAnuncios] = useState([]);
  const [nuevoAnuncio, setNuevoAnuncio] = useState('');
  const [icono, setIcono] = useState('alerta');
  const [mensaje, setMensaje] = useState('');

  const cargarAnuncios = async () => {
    try {
      const response = await axios.get(`${API_URL}/anuncios`);
      setAnuncios(response.data.anuncios || []);
    } catch (error) {
      console.error(error);
      setMensaje('No se pudieron cargar los anuncios');
    }
  };

  useEffect(() => {
    cargarAnuncios();
  }, []);

  const agregarAnuncio = async (event) => {
    event.preventDefault();
    if (!nuevoAnuncio.trim()) return;

    try {
      await axios.post(`${API_URL}/anuncios`, {
        texto: nuevoAnuncio.trim(),
        icono,
      });
      setNuevoAnuncio('');
      setIcono('alerta');
      setMensaje('Anuncio agregado');
      cargarAnuncios();
      setTimeout(() => setMensaje(''), 3000);
    } catch (error) {
      console.error(error);
      setMensaje('No se pudo agregar el anuncio');
    }
  };

  const borrarAnuncio = async (id) => {
    try {
      await axios.delete(`${API_URL}/anuncios/${id}`);
      cargarAnuncios();
    } catch (error) {
      console.error(error);
      setMensaje('No se pudo borrar el anuncio');
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Gestion de Anuncios</h1>

      <div className="card" style={{ marginBottom: '30px', padding: '20px', alignItems: 'stretch', textAlign: 'left' }}>
        <form onSubmit={agregarAnuncio} style={{ display: 'grid', gridTemplateColumns: '1fr 180px auto', gap: '10px' }}>
          <input
            type="text"
            placeholder="Nuevo anuncio..."
            value={nuevoAnuncio}
            onChange={(event) => setNuevoAnuncio(event.target.value)}
            style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }}
          />
          <select
            value={icono}
            onChange={(event) => setIcono(event.target.value)}
            style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }}
          >
            {opcionesIcono.map((opcion) => (
              <option key={opcion.valor} value={opcion.valor}>
                {opcion.texto}
              </option>
            ))}
          </select>
          <button type="submit" className="btn-primary" style={{ width: 'auto' }}>
            Publicar
          </button>
        </form>
        {mensaje && <p style={{ marginTop: '12px', color: 'var(--text-secondary)' }}>{mensaje}</p>}
      </div>

      <div className="card" style={{ padding: '20px', alignItems: 'stretch', textAlign: 'left' }}>
        <h3>Activos</h3>
        <div style={{ marginTop: '15px' }}>
          {anuncios.length === 0 && (
            <p style={{ color: 'var(--text-secondary)' }}>No hay anuncios registrados.</p>
          )}

          {anuncios.map((anuncio) => {
            const opcion = obtenerIcono(anuncio.icono);
            const Icono = opcion.Icono;

            return (
              <div
                key={anuncio.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '10px',
                  borderBottom: '1px solid #eee',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Icono size={24} color="#111827" />
                  <span>{anuncio.texto}</span>
                </div>
                <button
                  onClick={() => borrarAnuncio(anuncio.id)}
                  className="badge badge-danger"
                  type="button"
                >
                  Borrar
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Anuncios;
