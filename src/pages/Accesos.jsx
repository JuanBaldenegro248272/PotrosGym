import React, { useState } from 'react';
import { Search, ChevronDown, MoreVertical, Calendar, Filter, UserCheck } from 'lucide-react';

const Accesos = () => {
  const [terminoBusqueda, setTerminoBusqueda] = useState('');

  const [historialAccesos, setHistorialAccesos] = useState([]);

  const renderizarEstado = (estado) => {
    switch(estado) {
      case 'Registrado':
        return <span className="badge badge-success">Registrado</span>;
      case 'Baja':
        return <span className="badge badge-danger">Baja</span>;
      case 'Pendiente':
        return <span className="badge badge-warning">Pendiente</span>;
      default:
        return <span className="badge">{estado}</span>;
    }
  };

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>Gestión de Accesos</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn-primary" style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={18} />
            Exportar Reporte
          </button>
        </div>
      </div>

      {/* Panel de Filtros */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem', alignItems: 'stretch', textAlign: 'left' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '1.5rem', alignItems: 'end' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <Search size={14} style={{ marginRight: '4px' }} /> Buscar Usuario
            </label>
            <input 
              type="text" 
              placeholder="ID o Nombre completo..." 
              value={terminoBusqueda}
              onChange={(e) => setTerminoBusqueda(e.target.value)}
              style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Tipo</label>
            <select style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'white' }}>
              <option>Todos</option>
              <option>Alumno</option>
              <option>Entrenador</option>
              <option>Comunidad</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Fecha</label>
            <select style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'white' }}>
              <option>Hoy</option>
              <option>Última semana</option>
              <option>Este mes</option>
            </select>
          </div>

          <button className="btn-primary" style={{ height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <Filter size={18} /> Aplicar Filtros
          </button>
        </div>
      </div>

      {/* Resumen de Accesos */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card">
          <h3 className="card-title">Total Hoy</h3>
          <div className="card-value" style={{ margin: '0.5rem 0' }}>120</div>
          <div className="badge badge-success">▲ +5%</div>
        </div>
        <div className="card">
          <h3 className="card-title">Alumnos</h3>
          <div className="card-value" style={{ margin: '0.5rem 0' }}>95</div>
        </div>
        <div className="card">
          <h3 className="card-title">Comunidad</h3>
          <div className="card-value" style={{ margin: '0.5rem 0' }}>18</div>
        </div>
        <div className="card">
          <h3 className="card-title">Puerta Activa</h3>
          <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', fontWeight: '700' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'currentColor' }}></div>
            En línea
          </div>
        </div>
      </div>

      <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--primary-blue)' }}>Historial Reciente</h2>
      <div className="card" style={{ padding: '0', alignItems: 'stretch' }}>
        <div className="table-container" style={{ margin: 0, border: 'none' }}>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Fecha y Hora</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {historialAccesos.map((acceso, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: '700' }}>{acceso.id}</td>
                  <td style={{ textAlign: 'left', paddingLeft: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <UserCheck size={16} color="var(--primary-blue)" />
                      {acceso.nombre}
                    </div>
                  </td>
                  <td>{acceso.tipoUsuario}</td>
                  <td style={{ fontSize: '0.85rem', whiteSpace: 'pre-line', lineHeight: '1.2' }}>{acceso.fechaHora}</td>
                  <td>{renderizarEstado(acceso.estado)}</td>
                  <td>
                    <button style={{ color: 'var(--text-secondary)' }}><MoreVertical size={20} /></button>
                  </td>
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
