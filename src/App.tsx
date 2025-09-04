// Librerias
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";

// Componentes
import { SideBar } from "./components/SideBar";
import { PopUpForm } from "./components/PopUp/PopUpView";

// Context
import { ProductDataContext } from "./contexts/ProductsDataContext";

// Paginas
import { Dashboard } from "./pages/DashboardPage";
import Categories from "./pages/Categories";
import { Pedidos } from "./pages/Pedidos";
import { HistorialPedidos } from "./pages/HistorialPedidos";

// Helper
import { ProductDB, CategoryDB } from "./utils/DataBase";

// Estilos y Tipos
import './assets/styles.css';



export const App = () => {

  const [sectionName, setSectionName] = useState<String>("Pedidos")
  const {categoriesList, initCategoriesList, initProductList} = useContext(ProductDataContext)

  // Recuperar la información del backend
  useEffect(() => {

    ProductDB.getAll()
      .then((data) => {
        initProductList(data)
      })
    CategoryDB.getAll()
      .then((data) => {
        initCategoriesList(data)
      })

  }, []);

  return (

    <Router>
      

      <div className="app">

        <SideBar sectionNameSetter={setSectionName}></SideBar>

        <section className="content">

          <div className="section-tittle">
            <h1>{sectionName}</h1>
          </div>

          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/pedidos" element={<Pedidos />} />
            <Route path="/historial" element={<HistorialPedidos />} />
            <Route path="/" element={<Navigate to={"/pedidos"}></Navigate>}></Route>
          </Routes>

        </section>
      </div>
      
      <PopUpForm categories={categoriesList}></PopUpForm>
    </Router>
    
  );
};

export default App;
