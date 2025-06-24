import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { Dashboard } from "./components/Dashboard";
import Categories from "./components/Categories";
import { Items } from "./components/Items";
import './styles.css'
import { Pedidos } from "./components/Pedidos";
import { HistorialPedidos } from "./components/HistorialPedidos";
import './styles/navbar.css'


export const App = () => {

  return (

    <Router>
      <div>
        <nav className="navbar">
          <ul>
            <li>
              <Link to="/pedidos">Pedidos Entrantes</Link>
            </li>
            <li>
              <Link to="/dashboard">Productos en venta y Stock</Link>
            </li>
            <li>
              <Link to="/categories">Crear Categorias</Link>
            </li>
            <li>
              <Link to="/items">Agregar Productos</Link>
            </li>
            <li>
              <Link to="/historial">Historial de pedidos</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/items" element={<Items />} />
          <Route path="/pedidos" element={<Pedidos />} />
          <Route path="/historial" element={<HistorialPedidos />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
