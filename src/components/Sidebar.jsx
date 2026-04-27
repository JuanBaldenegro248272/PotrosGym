import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Fingerprint, ShoppingCart } from 'lucide-react';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div style={{
          width: '120px', 
          height: '120px', 
          borderRadius: '50%', 
          border: '2px solid white', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          flexDirection: 'column',
          textAlign: 'center',
          fontSize: '0.7rem'
        }}>
          ORGULLOSAMENTE<br/>POTROS<br/>ITSON
        </div>
      </div>
      <nav className="sidebar-nav">
        <NavLink 
          to="/" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          end
        >
          <Home size={24} />
          Inicio
        </NavLink>
        <NavLink 
          to="/accesos" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <Fingerprint size={24} />
          Accesos
        </NavLink>
        <NavLink 
          to="/ventas" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <ShoppingCart size={24} />
          Ventas
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
