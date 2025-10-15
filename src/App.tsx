// App.tsx
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useState, useContext } from "react";

// Componentes
import { SideBar } from "./components/SideBar";
import { PopUpForm } from "./components/PopUp/PopUpView";
import ProtectedRoute from "./components/protectedRoute";
import Login from "./components/Login";

// Context
import { ProductDataContext } from "./contexts/ProductsDataContext";

// Páginas
import { Dashboard } from "./pages/DashboardPage";
import Categories from "./pages/Categories";
import { Pedidos } from "./pages/Pedidos";
import { HistorialPedidos } from "./pages/HistorialPedidos_deprecated";
import { OrdersHistorial } from "./pages/OrdersHistorial/OrdersHistorialPage";

// Helpers
import { ProductDB, CategoryDB } from "./utils/DataBase";

// Estilos
import './assets/styles.css';

export const App = () => {
  const { categoriesList, initCategoriesList, initProductList } = useContext(ProductDataContext);
  const [sectionName, setSectionName] = useState<string>("Pedidos");
  const [loggedIn, setLoggedIn] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);

  // Función que se pasa al login
  const handleLogin = async () => {
    setLoggedIn(true); // desbloquea la app

    try {
      // Traemos productos y categorías una vez que el usuario loguea
      const products = await ProductDB.getAll();
      const categories = await CategoryDB.getAll();
      initProductList(products);
      initCategoriesList(categories);
      setIsDataLoaded(true)
    } catch (err) {
      console.error("Error al cargar productos o categorías", err);
    }
  };

  // Mientras no esté logueado, mostramos solo el login
  if (!loggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  
  // Si ya está logueado, renderizamos la app completa
  return (
    <Router>
      <div className="app">
        

        <section
          className={`content ${isNavOpen ? 'sidebar-open' : ''}`}
          /*style={isDataLoaded ? { "display": "block" } : { "display": "flex" }}*/>

          {!isDataLoaded
            
            ? <div className="spinner-border text-light" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            
            :<Routes>
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
              <Route path="/pedidos" element={<ProtectedRoute><Pedidos /></ProtectedRoute>} />
              <Route path="/historial" element={<ProtectedRoute><OrdersHistorial /></ProtectedRoute>} />

              {/* Redirige a pedidos por defecto */}
              <Route path="*" element={<Navigate to="/pedidos" />} />
            </Routes>
          }
        </section>

        <SideBar onOpenStatusChange={setIsNavOpen} />
      </div>

      <PopUpForm categories={categoriesList} />
    </Router>
  );
};

export default App;
