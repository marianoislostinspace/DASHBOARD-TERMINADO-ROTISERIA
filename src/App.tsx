// Librerias
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";

// Componentes
import { SideBar } from "./components/SideBar";
import { ProductForm } from "./components/PopUp/ProductForm";

// Helpers
import { fetchApi } from "./api";

// Context
import { ProductDataContext } from "./contexts/ProductsDataContext";

// Paginas
import { Dashboard } from "./pages/DashboardPage";
import Categories from "./pages/Categories";
import { Items } from "./components/Items";
import { Pedidos } from "./pages/Pedidos";
import { HistorialPedidos } from "./pages/HistorialPedidos";

// Estilos y Tipos
import type { Product, Category } from "./assets/types/types";
import './assets/styles.css';



export const App = () => {

  const [sectionName, setSectionName] = useState<String>("Pedidos")
  const {categoriesList, initCategoriesList, initProductList} = useContext(ProductDataContext)

  // Recuperar la información del backend
  useEffect(() => {
    const getItemsAndCategories = async () => {
      try {
        const itemsData: Product[] = await fetchApi("platos");
        const categoriesData: Category[] = await fetchApi("categorias");
        initProductList(itemsData);
        initCategoriesList(categoriesData);
      } catch (error) {
        console.error("Error al obtener los ítems y categorías:", error);
      }
    };
    getItemsAndCategories();
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
