import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Accesos from './pages/Accesos';
import Login from './pages/Login/Login';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="accesos" element={<Accesos />} />
          <Route path="ventas" element={<div>Página de Ventas</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;