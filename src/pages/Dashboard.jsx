import React from 'react';
import { User, AlertTriangle, Calendar, ClipboardList } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const datosOcupacion = [
    { nombre: 'Ocupado', valor: 72 },
    { nombre: 'Disponible', valor: 28 },
  ];
  const coloresGrafica = ['#0b4a8c', '#e2e8f0'];

  const manejarAbrirPuerta = () => {
    alert("Abriendo puerta de entrada...");
  };

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
          <div style={{ fontWeight: '700', marginBottom: '0.25rem' }}>Luis Campoy</div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '1rem' }}>Horario: 10:00 - 13:00</div>
          <div style={{ flex: 1 }}></div>
          <button className="btn-primary">Ver información</button>
        </div>

        <div className="card">
          <h3 className="card-title">Accesos registrados hoy</h3>
          <div className="card-value" style={{ margin: '1rem 0' }}>120</div>
          <div className="card-subtitle">Accesos</div>
          <div style={{ flex: 1 }}></div>
          <button className="btn-primary">Ver reporte</button>
        </div>

        <div className="card">
          <h3 className="card-title">Ocupación del gimnasio</h3>
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
              72%
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%', marginTop: '1rem', fontSize: '0.8rem', fontWeight: '600' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '12px', height: '12px', backgroundColor: '#0b4a8c', borderRadius: '2px' }}></div>
              Ocupado
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '12px', height: '12px', backgroundColor: '#e2e8f0', borderRadius: '2px' }}></div>
              Disponible
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="card-title">Ventas y Rentas del día</h3>
          <div className="card-value" style={{ margin: '1rem 0' }}>58</div>
          <div className="card-subtitle">Artículos</div>
          <div style={{ flex: 1 }}></div>
          <button className="btn-primary">Ver reporte</button>
        </div>

        <div className="card">
          <h3 className="card-title">Puerta de entrada</h3>
          <div style={{ margin: '1rem 0' }}>
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="9" y1="3" x2="9" y2="21"></line>
              <line x1="15" y1="3" x2="15" y2="21"></line>
              <line x1="9" y1="9" x2="15" y2="9"></line>
              <line x1="9" y1="15" x2="15" y2="15"></line>
            </svg>
          </div>
          <div style={{ flex: 1 }}></div>
          <button className="btn-primary" onClick={manejarAbrirPuerta}>Abrir</button>
        </div>

      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>

        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '1rem' }}>Anuncios</h2>
          <div className="card" style={{ padding: '0', alignItems: 'stretch' }}>
            <div style={{ padding: '0.5rem 1.5rem 1rem 1.5rem' }}>
              <div style={{ display: 'flex', padding: '1rem 0', borderBottom: '1px solid var(--border-color)', gap: '1rem', alignItems: 'center' }}>
                <AlertTriangle size={24} color="#111827" />
                <p style={{ fontSize: '0.85rem', fontWeight: '600' }}>El área de pesas libres permanecerá cerrada hoy de 14:00 a 16:00 h por limpieza profunda y mantenimiento.</p>
              </div>

              <div style={{ display: 'flex', padding: '1rem 0', borderBottom: '1px solid var(--border-color)', gap: '1rem', alignItems: 'center' }}>
                <Calendar size={24} color="#111827" />
                <p style={{ fontSize: '0.85rem', fontWeight: '600' }}>Nuestras instalaciones permanecerán cerradas el día 1 de mayo con motivo del Día del Trabajo.</p>
              </div>

              <div style={{ display: 'flex', padding: '1rem 0', gap: '1rem', alignItems: 'center' }}>
                <ClipboardList size={24} color="#111827" />
                <p style={{ fontSize: '0.85rem', fontWeight: '600' }}>Las fechas para reinscripciones son del 15 al 21 de abril. Favor de realizar su pago en tiempo.</p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                <button className="btn-primary" style={{ width: 'auto' }}>Ver mas</button>
              </div>
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
                  {[
                    { id: '000248272', nombre: 'Juan Rascon', fechaHora: '03/22/26 10:48 A.M.' },
                    { id: '000123453', nombre: 'Jose Reyes', fechaHora: '03/22/26 10:48 A.M.' },
                    { id: '000213254', nombre: 'Marina Pérez', fechaHora: '03/22/26 10:48 A.M.' },
                    { id: '000341234', nombre: 'Sara Torres', fechaHora: '03/22/26 10:48 A.M.' }
                  ].map((accesoReciente, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '1rem 0.75rem', fontWeight: '600' }}>{accesoReciente.id}</td>
                      <td style={{ padding: '1rem 0.75rem', fontWeight: '600' }}>{accesoReciente.nombre}</td>
                      <td style={{ padding: '1rem 0.75rem', fontWeight: '600' }}>{accesoReciente.fechaHora}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
                <button className="btn-primary" style={{ width: 'auto' }}>Ver mas</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
