// Librerias
import React, { useState, useContext } from "react";
import Swal from 'sweetalert2'
//Helpers
import { fetchApi } from "../api";
// Contextos
import { ProductDataContext } from "../contexts/ProductsDataContext";
import { usePopUpDispatch, usePopUpStates } from "../contexts/PopUpContext";
// Tipos y Estilos
import type { Product } from "../assets/types/types";



export const Dashboard = () => {
  const { productsList, categoriesList } = useContext(ProductDataContext)
  const isVisible = usePopUpStates()
  const { handleIsVisible, handleIsEditing, handleFormData, handleFormType } = usePopUpDispatch()

  const [detalle, setdetalle] = useState<Boolean>(false)
  const [singlePlato, setsinglePlato] = useState<Product | null>(null)

  // Estados para agregar opción
  const [activeOptionFormId, setActiveOptionFormId] = useState<string | null>(null);
  const [optionName, setOptionName] = useState("");
  const [optionExtraPrice, setOptionExtraPrice] = useState<number | "">("");


  const handleDeleteItem = async (itemId: string, categoriaId: string) => {
    const result = await Swal.fire({
      title: "¿Estás seguro que quieres eliminar este producto?",
      text: "¡No hay vuelta atrás!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar"
    });

    // Delete Logic
    /*
    if (result.isConfirmed) {
      try {
        await fetchApi(`platos/categorias/${categoriaId}/${itemId}`, "DELETE");
        setItems((prev) => prev.filter((item) => item.id !== itemId));

        await Swal.fire({
          title: "Eliminado",
          text: "Producto eliminado exitosamente.",
          icon: "success"
        });
      } catch (error) {
        console.error("Error al eliminar el producto:", error);
        Swal.fire("Error", "No se pudo eliminar el producto.", "error");
      }
    }
    */
  };

  /* Genera el Pop Up para editar el campo */
  const handleEditFields = (item: Product) => {
    handleIsEditing(true)
    handleFormData(item)
    handleIsVisible(true)
    handleFormType("product")
  }

  // Funcion para agregar opciones al plato
  const handleAddOption = async (productId: string) => {
    const product = productsList.find(item => item.id === productId);
    const categoryId = product ? product.categoriaId : null;

    if (!optionName) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "El nombre de la opcion es obligatorio!",
        footer: '<a href="#">Why do I have this issue?</a>'
      });
      return;
    }

    if (!categoryId) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "No se encontro la categoria del producto!",
        footer: '<a href="#">Why do I have this issue?</a>'
      });
      return;
    }

    try {
      const newOption = {
        nombre: optionName,
        precioExtra: optionExtraPrice || 0,
      };

      await fetchApi(`opciones/categorias/${categoryId}/platos/${productId}/opciones`, "POST", newOption);
      Swal.fire({
        title: "Completado!",
        icon: "success",
        text: "opcion agregada correctamente",
        draggable: true
      }); setOptionName("");
      setOptionExtraPrice("");
      setActiveOptionFormId(null);
    } catch (error) {
      console.error("Error al agregar la opción:", error); Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Hubo un error al agregar la opción!",
        footer: '<a href="#">Why do I have this issue?</a>'
      });
    }
  };


  const deleteOption = async (categoriaId: string, itemId: string, opcionId: string) => {
    const result = await Swal.fire({
      title: "¿Estás seguro que quieres eliminar esta categoria?",
      text: "¡No hay vuelta atrás!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar"
    });

    if (result.isConfirmed) {
      try {
        await fetchApi(`opciones/categorias/${categoriaId}/platos/${itemId}/opciones/${opcionId}`, "DELETE");
      } catch (error) {
        console.error("Error al eliminar la opción:", error);
      }
    }

  }


  const getDetalles = (plato: Product) => {
    setsinglePlato(plato)
    setdetalle(true)

  }

  const goBack = () => {
    setdetalle(false)
    console.log("Volviendo, detalles:", false)
  }



  return (
    <div>
      {/* Lista de productos */}
      <div className="itemContainer">
        {detalle ? (
          <div className="singleItem">
            <h1>{singlePlato?.nombre}</h1>
            <h3>{singlePlato?.descripcion}</h3>
            <h2>${singlePlato?.precio}</h2>
            <img src={singlePlato?.imagen} alt={singlePlato?.nombre} />
            {singlePlato?.opciones?.map((opc, index) => (
              <li key={index} className="lista">
                <p>{opc.nombre}</p>
                {opc.precio && <p>Precio extra: ${opc.precio}</p>}
                <button className="listBtn" onClick={() => deleteOption(singlePlato.categoriaId, singlePlato.id, opc.id)}
                >
                  borrar
                </button>
              </li>
            ))}


            <button onClick={goBack} className='volverBtn'>Volver</button>

          </div>
        ) : (
          productsList.map((item) => (
            <div key={item.id} className="item-card">
              <h3>{item.nombre}</h3>
              <p>{item.descripcion}</p>
              <p>Precio: ${item.precio}</p>
              <p>Precio de Descuento: ${item.precioDescuento}</p>
              <img src={item.imagen} alt={item.nombre} onClick={() => getDetalles(item)} />

              <button onClick={() => handleDeleteItem(item.id, item.categoriaId)}>Eliminar</button>
              <button onClick={() => handleEditFields(item)}>Editar</button>
              <button onClick={() => setActiveOptionFormId(item.id)}>Agregar opción</button>

              {/* Formulario para agregar opción */}
              {activeOptionFormId === item.id && (
                <div style={{ marginTop: "10px" }}>
                  <input
                    type="text"
                    placeholder="Nombre de la opción"
                    value={optionName}
                    onChange={(e) => setOptionName(e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Precio extra (opcional)"
                    value={optionExtraPrice}
                    onChange={(e) => setOptionExtraPrice(Number(e.target.value))}
                  />
                  <button onClick={() => handleAddOption(item.id)}>Guardar opción</button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Formulario de edición 
      
      {editItem && (
        
      )}
      
      */}

    </div>
  );
};

































