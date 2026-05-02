import React from 'react';
import './Login.css';
import { FaUser, FaLock } from 'react-icons/fa';

function Login() {
  return (
    <div className="login-container">
      
      <div className="login-panel-blue">
        <div className="logo-sidebar-container">
          <div className="large-white-logo-placeholder">LOGO P</div>
        </div>
      </div>

      <div className="login-panel-white">
        
        <div className="login-content-wrapper">
          
          <div className="header-text-container">
            <h1>Gimnasio <span className="blue-text">POTROS</span></h1>
            <p className="subtitle">Bienvenido!</p>
          </div>

          <h2 className="form-title">INICIAR SESIÓN</h2>

          <div className="login-card">
            <form className="login-form">
              
              <div className="input-row">
                <label className="input-label">Usuario:</label>
                <div className="input-field">
                  <FaUser className="input-icon" />
                  <input type="text" placeholder="" />
                </div>
              </div>

              <div className="input-row">
                <label className="input-label">Contraseña:</label>
                <div className="input-field">
                  <FaLock className="input-icon" />
                  <input type="password" placeholder="" />
                </div>
              </div>

            </form>
          </div>

          <div className="bottom-actions-container">
            <a href="#" className="forgot-link">¿Olvidaste tu contraseña?</a>
            <button type="submit" className="login-btn">ACCEDER</button>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;