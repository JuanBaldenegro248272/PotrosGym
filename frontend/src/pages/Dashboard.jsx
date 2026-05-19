import React, { useEffect, useState } from 'react';
import { AlertTriangle, Calendar, ClipboardList, User } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const API_URL = 'http://localhost:8000';

const iconosAnuncio = {
  alerta: AlertTriangle,
  calendario: Calendar,
  lista: ClipboardList,
};

const Dashboard = () => {
  const [datos, setDatos] = useState({
    accesosHoy: 0,
    alumnosActivos: 0,
    anuncios: [],
    accesosRecientes: [],
  });

  useEffect(() => {
    const cargarDashboard = async () => {
      try {
        const response = await fetch(`${API_URL}/dashboard`);
        const data = await response.json();
        setDatos(data);
      } catch (error) {
        console.error(error);
      }
    };

    cargarDashboard();
  }, []);

  const ocupacion = Math.min(datos.accesosHoy * 5, 100);
  const datosOcupacion = [
    { nombre: 'Ocupado', valor: ocupacion },
    { nombre: 'Disponible', valor: 100 - ocupacion },
  ];
  const coloresGrafica = ['#0b4a8c', '#e2e8f0'];

  return (
    <div>
      <h1 className="page-title">Dashboard</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card">
          <h3 className="card-title">Entrenador en turno</h3>
          <div style={{ margin: '1rem 0' }}>
            <div style={{ background: '#f3f4f6', borderRadius: '50%', padding: '0.5rem', display: 'inline-block' }}>
              <User size={40} color="#111827" />
            </div>
          </div>
          <div style={{ fontWeight: '700', marginBottom: '0.25rem' }}>Sin asignar</div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '1rem' }}>Horario: --:--</div>
          <div style={{ flex: 1 }} />
          <button className="btn-primary">Ver informacion</button>
        </div>

        <div className="card">
          <h3 className="card-title">Accesos registrados hoy</h3>
          <div className="card-value" style={{ margin: '1rem 0' }}>{datos.accesosHoy}</div>
          <div className="card-subtitle">Accesos</div>
          <div style={{ flex: 1 }} />
          <button className="btn-primary">Ver reporte</button>
        </div>

        <div className="card">
          <h3 className="card-title">Ocupacion del gimnasio</h3>
          <div style={{ width: '100%', height: '120px', position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={datosOcupacion}
                  cx="50%"
                  cy="100%"
                  startAngle={180}
                  endAngle={0}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={0}
                  dataKey="valor"
                  stroke="none"
                >
                  {datosOcupacion.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={coloresGrafica[index % coloresGrafica.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ position: 'absolute', bottom: '0', left: '0', width: '100%', textAlign: 'center', fontSize: '1.5rem', fontWeight: '800' }}>
              {ocupacion}%
            </div>
          </div>
          <div style={{ marginTop: '1rem', fontSize: '0.8rem', fontWeight: '600' }}>
            Calculado con accesos de hoy
          </div>
        </div>

        <div className="card">
          <h3 className="card-title">Alumnos activos</h3>
          <div className="card-value" style={{ margin: '1rem 0' }}>{datos.alumnosActivos}</div>
          <div className="card-subtitle">Registrados</div>
          <div style={{ flex: 1 }} />
          <button className="btn-primary">Ver alumnos</button>
        </div>

        <div className="card">
          <h3 className="card-title">Puerta de entrada</h3>
          <div style={{ margin: '1rem 0' }}>
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="9" y1="3" x2="9" y2="21" />
              <line x1="15" y1="3" x2="15" y2="21" />
              <line x1="9" y1="9" x2="15" y2="9" />
              <line x1="9" y1="15" x2="15" y2="15" />
            </svg>
          </div>
          <div style={{ flex: 1 }} />
          <button className="btn-primary">En linea</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '1rem' }}>Anuncios</h2>
          <div className="card" style={{ padding: '0', alignItems: 'stretch' }}>
            <div style={{ padding: '0.5rem 1.5rem 1rem 1.5rem' }}>
              {datos.anuncios.length === 0 && (
                <p style={{ padding: '1rem 0', fontWeight: '600' }}>No hay anuncios registrados.</p>
              )}

              {datos.anuncios.map((anuncio, index) => {
                const Icono = iconosAnuncio[anuncio.icono] || iconosAnuncio.alerta;
                return (
                  <div key={anuncio.id} style={{ display: 'flex', padding: '1rem 0', borderBottom: '1px solid var(--border-color)', gap: '1rem', alignItems: 'center' }}>
                    <Icono size={24} color="#111827" />
                    <p style={{ fontSize: '0.85rem', fontWeight: '600' }}>{anuncio.texto}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '1rem' }}>Alumnos</h2>
          <div className="card" style={{ padding: '0', alignItems: 'stretch' }}>
            <div style={{ padding: '0.5rem 1.5rem 1rem 1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem', textAlign: 'center' }}>Accesos recientes</h3>
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f3f4f6', borderBottom: '1px solid var(--border-color)' }}>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>ID</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Nombre</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Acceso</th>
                  </tr>
                </thead>
                <tbody>
                  {datos.accesosRecientes.length === 0 && (
                    <tr>
                      <td colSpan="3" style={{ padding: '1rem' }}>No hay accesos recientes.</td>
                    </tr>
                  )}

                  {datos.accesosRecientes.map((acceso) => (
                    <tr key={acceso.id}>
                      <td style={{ padding: '0.75rem', textAlign: 'left' }}>{acceso.id}</td>
                      <td style={{ padding: '0.75rem', textAlign: 'left' }}>{acceso.nombre}</td>
                      <td style={{ padding: '0.75rem', textAlign: 'left' }}>{acceso.fechaHora}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
