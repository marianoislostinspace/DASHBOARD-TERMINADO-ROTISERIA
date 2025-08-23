// Librerias
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from "react-router-dom";
import { useState, useEffect, useContext, useImperativeHandle } from "react";

// Componentes
import { SideBar } from "./components/SideBar";
import { ProductForm } from "./components/PopUp/ProductForm";

// Helpers
import { fetchApi } from "./utils/api";

// Context
import { ProductDataContext } from "./contexts/ProductsDataContext";

// Paginas
import { Dashboard } from "./pages/DashboardPage";
import Categories from "./pages/Categories";
import { Items } from "./components/Items";
import { Pedidos } from "./pages/Pedidos";
import { HistorialPedidos } from "./pages/HistorialPedidos";

// Helper
import { getItemsAndCategories } from "./utils/productDBHandler";

// Estilos y Tipos
import type { Product, Category } from "./assets/types/types";
import './assets/styles.css';



export const App = () => {

  const [sectionName, setSectionName] = useState<String>("Pedidos")
  const {categoriesList, initCategoriesList, initProductList} = useContext(ProductDataContext)

  // Recuperar la información del backend
  useEffect(() => {
    getItemsAndCategories()
      .then((data) => {
        if (data) {
          initCategoriesList(data.Categories)
          initProductList(data.Products)
        }
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
            <Route path="/items" element={<Items />} />
            <Route path="/pedidos" element={<Pedidos />} />
            <Route path="/historial" element={<HistorialPedidos />} />
            <Route path="/" element={<Navigate to={"/pedidos"}></Navigate>}></Route>
          </Routes>

        </section>
      </div>
      
      <ProductForm categories={categoriesList}></ProductForm>
    </Router>
    
  );
};

export default App;
