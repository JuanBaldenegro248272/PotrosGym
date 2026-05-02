import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Fingerprint, ShoppingCart, Users } from 'lucide-react';
import logo from '../assets/logo.png';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img src={logo} alt="logo Potros" />
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
          to="/alumnos"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <Users size={24} />
          Alumnos
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
