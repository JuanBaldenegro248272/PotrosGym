import React, { useState } from 'react';
import { UserPlus, Search, Fingerprint, UserCheck, UserX, Pencil, Trash2, Eye } from 'lucide-react';

const Alumnos = () => {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [alumnos, setAlumnos] = useState([]);

  const eliminarAlumno = (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este alumno?")) {
      setAlumnos(alumnos.filter(a => a.id !== id));
    }
  };

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>Gestión de Alumnos</h1>
        <button
          className="btn-primary"
          style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem' }}
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
        >
          <UserPlus size={20} />
          {mostrarFormulario ? 'Cancelar Registro' : 'Nuevo Registro'}
        </button>
      </div>

      {mostrarFormulario && (
        <div className="card" style={{ marginBottom: '2rem', padding: '2rem', textAlign: 'left', alignItems: 'stretch' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', color: 'var(--primary-blue)' }}>
            Registrar Nuevo Integrante
          </h2>

          <form style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: '600', fontSize: '0.9rem' }}>Nombre Completo</label>
              <input
                type="text"
                placeholder="Ej. Juan Pérez García"
                style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: '600', fontSize: '0.9rem' }}>ID / Matrícula</label>
              <input
                type="text"
                placeholder="Ej. 2024005"
                style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: '600', fontSize: '0.9rem' }}>Estado Inicial</label>
              <select style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'white' }}>
                <option>Activo</option>
                <option>Pendiente</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: '600', fontSize: '0.9rem' }}>Captura de Huella (PersonaGym.huellaID)</label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.5rem',
                background: '#f8fafc',
                borderRadius: '8px',
                border: '1px dashed var(--primary-blue)'
              }}>
                <div style={{ background: 'white', padding: '0.5rem', borderRadius: '6px', boxShadow: 'var(--shadow-sm)' }}>
                  <Fingerprint size={32} color="var(--primary-blue)" />
                </div>
                <button type="button" className="btn-primary" style={{ width: 'auto', fontSize: '0.8rem' }}>
                  Iniciar Escaneo
                </button>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Esperando huella...</span>
              </div>
            </div>

            <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button type="submit" className="btn-primary" style={{ width: '200px', padding: '1rem' }}>
                Guardar Alumno
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card" style={{ padding: '0', alignItems: 'stretch' }}>
        <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Buscar por nombre o ID..."
              style={{ width: '100%', padding: '0.6rem 0.6rem 0.6rem 2.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}
            />
          </div>
          <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
            Mostrando {alumnos.length} alumnos registrados
          </div>
        </div>

        <div className="table-container" style={{ margin: 0, border: 'none', boxShadow: 'none' }}>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Huella ID</th>
                <th>Fecha Registro</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {alumnos.map((alumno) => (
                <tr key={alumno.id}>
                  <td style={{ fontWeight: '700' }}>{alumno.id}</td>
                  <td style={{ textAlign: 'left', paddingLeft: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <UserCheck size={16} />
                      </div>
                      {alumno.nombre}
                    </div>
                  </td>
                  <td>
                    <code style={{ background: '#f1f5f9', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>{alumno.huellaID}</code>
                  </td>
                  <td>{alumno.fechaRegistro}</td>
                  <td>
                    <span className={`badge ${alumno.estado === 'Activo' ? 'badge-success' : 'badge-danger'}`}>
                      {alumno.estado}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                      <button
                        title="Ver detalles"
                        style={{ padding: '0.4rem', borderRadius: '6px', color: 'var(--text-secondary)', background: '#f1f5f9' }}
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        title="Editar"
                        style={{ padding: '0.4rem', borderRadius: '6px', color: 'var(--primary-blue)', background: '#eff6ff' }}
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        title="Eliminar"
                        onClick={() => eliminarAlumno(alumno.id)}
                        style={{ padding: '0.4rem', borderRadius: '6px', color: 'var(--danger)', background: '#fef2f2' }}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
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

export default Alumnos;
