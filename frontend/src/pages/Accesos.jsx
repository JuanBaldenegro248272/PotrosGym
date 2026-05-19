import React, { useEffect, useMemo, useState } from 'react';
import { Calendar, Filter, Search, UserCheck } from 'lucide-react';

const API_URL = 'http://localhost:8000';

const Accesos = () => {
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [historialAccesos, setHistorialAccesos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const cargarAccesos = async () => {
    try {
      const response = await fetch(`${API_URL}/accesos`);
      const data = await response.json();
      setHistorialAccesos(data);
    } catch (error) {
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarAccesos();
  }, []);

  const accesosFiltrados = useMemo(() => {
    const texto = terminoBusqueda.trim().toLowerCase();
    if (!texto) return historialAccesos;

    return historialAccesos.filter((acceso) => (
      String(acceso.id).includes(texto)
      || acceso.nombre.toLowerCase().includes(texto)
      || String(acceso.huellaID).includes(texto)
    ));
  }, [historialAccesos, terminoBusqueda]);

  const totalHoy = historialAccesos.filter((acceso) => {
    const hoy = new Date().toISOString().slice(0, 10);
    return acceso.fechaHora.startsWith(hoy);
  }).length;

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>Gestion de Accesos</h1>
        <button className="btn-primary" style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar size={18} />
          Exportar Reporte
        </button>
      </div>

      <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem', alignItems: 'stretch', textAlign: 'left' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', alignItems: 'end' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <Search size={14} style={{ marginRight: '4px' }} /> Buscar usuario
            </label>
            <input
              type="text"
              placeholder="ID, nombre o huella..."
              value={terminoBusqueda}
              onChange={(event) => setTerminoBusqueda(event.target.value)}
              style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}
            />
          </div>

          <button
            className="btn-primary"
            onClick={cargarAccesos}
            style={{ height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            type="button"
          >
            <Filter size={18} /> Actualizar
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card">
          <h3 className="card-title">Total hoy</h3>
          <div className="card-value" style={{ margin: '0.5rem 0' }}>{totalHoy}</div>
        </div>
        <div className="card">
          <h3 className="card-title">Total registrados</h3>
          <div className="card-value" style={{ margin: '0.5rem 0' }}>{historialAccesos.length}</div>
        </div>
        <div className="card">
          <h3 className="card-title">Puerta</h3>
          <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', fontWeight: '700' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'currentColor' }} />
            En linea
          </div>
        </div>
      </div>

      <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--primary-blue)' }}>Historial reciente</h2>
      <div className="card" style={{ padding: '0', alignItems: 'stretch' }}>
        <div className="table-container" style={{ margin: 0, border: 'none' }}>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Huella</th>
                <th>Fecha y hora</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {cargando && (
                <tr>
                  <td colSpan="5">Cargando accesos...</td>
                </tr>
              )}

              {!cargando && accesosFiltrados.length === 0 && (
                <tr>
                  <td colSpan="5">No hay accesos para mostrar.</td>
                </tr>
              )}

              {accesosFiltrados.map((acceso) => (
                <tr key={acceso.id}>
                  <td style={{ fontWeight: '700' }}>{acceso.id}</td>
                  <td style={{ textAlign: 'left', paddingLeft: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <UserCheck size={16} color="var(--primary-blue)" />
                      {acceso.nombre}
                    </div>
                  </td>
                  <td>{acceso.huellaID}</td>
                  <td style={{ fontSize: '0.85rem' }}>{acceso.fechaHora}</td>
                  <td><span className="badge badge-success">{acceso.estado}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Accesos;
