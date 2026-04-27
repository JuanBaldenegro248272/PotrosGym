import React, { useState } from 'react';
import { Search, ChevronDown, MoreVertical } from 'lucide-react';

const Accesos = () => {
  const [terminoBusqueda, setTerminoBusqueda] = useState('');

  const [historialAccesos, setHistorialAccesos] = useState([]);

  const renderizarEstado = (estado) => {
    switch(estado) {
      case 'Registrado':
        return <span className="badge" style={{ backgroundColor: '#00d000', color: '#000' }}>Registrado</span>;
      case 'Baja':
        return <span className="badge" style={{ backgroundColor: '#cc0000', color: '#fff' }}>Baja</span>;
      case 'Pendiente':
        return <span className="badge" style={{ backgroundColor: '#ff8c00', color: '#000' }}>Pendiente</span>;
      default:
        return <span className="badge">{estado}</span>;
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>Gestion de accesos</h1>
        <button style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280' }}>Añadir usuario</button>
      </div>

      <div className="card" style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', padding: '1.5rem', marginBottom: '1.5rem', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <label style={{ fontWeight: '700', marginBottom: '0.5rem', fontSize: '1.1rem' }}>Filtros avanzados</label>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input 
              type="text" 
              placeholder="Buscar por ID o Nombre completo" 
              value={terminoBusqueda}
              onChange={(e) => setTerminoBusqueda(e.target.value)}
              style={{ width: '100%', padding: '0.5rem 1rem 0.5rem 2.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', outline: 'none' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: '700', marginBottom: '0.25rem' }}>Tipos de usuario</label>
          <div style={{ position: 'relative', width: '150px' }}>
            <select style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', appearance: 'none', backgroundColor: 'white' }}>
              <option>Todos</option>
            </select>
            <ChevronDown size={16} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: '700', marginBottom: '0.25rem' }}>Rango de fechas</label>
          <div style={{ position: 'relative', width: '150px' }}>
            <select style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', appearance: 'none', backgroundColor: 'white' }}>
              <option>Hoy</option>
            </select>
            <ChevronDown size={16} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: '700', marginBottom: '0.25rem' }}>Estado</label>
          <div style={{ position: 'relative', width: '150px' }}>
            <select style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', appearance: 'none', backgroundColor: 'white' }}>
              <option>Registrado</option>
            </select>
            <ChevronDown size={16} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        
        <div className="card">
          <h3 className="card-title">Accesos de Hoy</h3>
          <div className="card-value" style={{ margin: '0.5rem 0' }}>120</div>
          <div style={{ color: '#10b981', fontWeight: '700', fontSize: '0.875rem' }}>▲ +5%</div>
        </div>

        <div className="card">
          <h3 className="card-title">Acceso de alumnos</h3>
          <div className="card-value" style={{ margin: '0.5rem 0' }}>95</div>
        </div>

        <div className="card">
          <h3 className="card-title">Acceso de selectivos</h3>
          <div className="card-value" style={{ margin: '0.5rem 0' }}>12</div>
        </div>

        <div className="card">
          <h3 className="card-title">Acceso de la comunidad</h3>
          <div className="card-value" style={{ margin: '0.5rem 0' }}>7</div>
        </div>

        <div className="card" style={{ alignItems: 'flex-start' }}>
          <h3 className="card-title" style={{ alignSelf: 'center' }}>Dispositivos</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>
            <span>Puerta A</span>
            <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#10b981' }}></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '0.875rem', fontWeight: '600' }}>
            <span>Cámara A</span>
            <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#ef4444' }}></div>
          </div>
        </div>

      </div>

      <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1rem' }}>Historial</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Tipo de usuario</th>
              <th>Acceso</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {historialAccesos.map((acceso, i) => (
              <tr key={i}>
                <td>{acceso.id}</td>
                <td>{acceso.nombre}</td>
                <td>{acceso.tipoUsuario}</td>
                <td style={{ whiteSpace: 'pre-line', lineHeight: '1.4' }}>{acceso.fechaHora}</td>
                <td>{renderizarEstado(acceso.estado)}</td>
                <td>
                  <button style={{ padding: '0.25rem' }}>
                    <MoreVertical size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default Accesos;
