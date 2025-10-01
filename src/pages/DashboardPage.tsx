// Librerias
import { useState, useContext } from "react";
import Swal from 'sweetalert2'
//Helpers
import { fetchApi } from "../utils/api";
import { ProductDB } from "../utils/DataBase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// Contextos
import { ProductDataContext } from "../contexts/ProductsDataContext";
import { emptyProduct, usePopUpDispatch } from "../contexts/PopUpContext";
// Tipos y Estilos
import type { Product } from "../assets/types/types";
import { swalThemeConfig } from "../assets/ThemeData";
import '../assets/styles/dashboardStyles.css'
import { SwalNotification, SwalUnexpectedError } from "../utils/swalNotification";
import { faTrashCan, faDollarSign } from '@fortawesome/free-solid-svg-icons'; // Example icons



export const Dashboard = () => {
  // Contextos
  const { productsList, initProductList } = useContext(ProductDataContext)
  const { handleIsVisible, handleIsEditing, handleFormData, handleFormType } = usePopUpDispatch()

  const [detalle, setdetalle] = useState<Boolean>(false)
  const [singlePlato, setsinglePlato] = useState<Product | null>(null)

  // Estados para agregar opción
  const [activeOptionFormId, setActiveOptionFormId] = useState<string | null>(null);
  const [optionName, setOptionName] = useState("");
  const [optionExtraPrice, setOptionExtraPrice] = useState<number | "">("");


  // Elimina un archivo de la base de datos
  const handleDeleteItem = async (itemId: string, categoriaId: string) => {
    const result = await Swal.fire({
      ...swalThemeConfig,
      title: "¿Estás seguro que quieres eliminar este producto?",
      text: "¡No hay vuelta atrás!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar"
    });

    // Delete Logic

    if (result.isConfirmed) {
      try {

        ProductDB.delete(itemId, categoriaId)

        // Edicion local
        initProductList(productsList.filter((p) => {
          return p.id != itemId
        }))

        Swal.fire({
          ...swalThemeConfig,
          title: "Eliminado",
          text: "Producto eliminado exitosamente.",
          icon: "success"
        });


      } catch (error) {
        SwalUnexpectedError.fire()
      }
    }

  };

  /* Editar productos (Abre el formulario de productos) */
  const handleEditFields = (item: Product) => {
    handleIsEditing(true)
    handleFormData(item)
    handleIsVisible(true)
    handleFormType("product")
  }


  // Agregar productos (Abre formulario de productos)
  const handleAddFields = (item: Product) => {
    handleIsEditing(true)
    handleFormData(emptyProduct)
    handleIsVisible(true)
    handleFormType("add")
  }

  // Funcion para agregar opciones al plato
  const handleAddOption = async (productId: string) => {
    const product = productsList.find(item => item.id === productId);
    const categoryId = product ? product.categoriaId : null;

    if (!optionName) {
      Swal.fire({
        ...swalThemeConfig,
        icon: "error",
        title: "Oops...",
        text: "El nombre de la opcion es obligatorio!",
        footer: '<a href="#">Why do I have this issue?</a>'
      });
      return;
    }

    if (!categoryId) {
      Swal.fire({
        ...swalThemeConfig,
        icon: "error",
        title: "Oops...",
        text: "No se encontro la categoria del producto!",
        footer: '<a href="#">Why do I have this issue?</a>'
      });
      return;
    }

    SwalNotification.fire({
      title: "Cargando...",
      icon: "info"
    });

    try {
      const newOptionData = {
        nombre: optionName,
        precioExtra: optionExtraPrice || 0,
      };

      const dbRef = await fetchApi(
        `opciones/${categoryId}/${productId}`,
        "POST",
        newOptionData
      );

      const newOption = { ...newOptionData, id: dbRef.id };

      const updatedProducts = productsList.map((p) =>
        p.id === productId
          ? { ...p, opciones: [...(p.opciones || []), newOption] }
          : p
      );
      initProductList(updatedProducts);

      setOptionName("");
      setOptionExtraPrice("");
      setActiveOptionFormId(null);

      SwalNotification.fire({
        title: "Completado!",
        icon: "success",
        text: "Opción agregada correctamente",
      });
    } catch (error) {
      console.error("Error al agregar la opción:", error);
      Swal.fire("Error", "No se pudo agregar la opción", "error");
    }
  };

  // Borrar opciones del plato
  const deleteOption = async (categoriaId: string, itemId: string, opcionId: string) => {
    const result = await Swal.fire({
      ...swalThemeConfig,
      title: "¿Estás seguro que quieres eliminar esta categoria?",
      text: "¡No hay vuelta atrás!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar"
    });

    if (result.isConfirmed) {
      try {
        const dbRef = await fetchApi(`opciones/${categoriaId}/${itemId}/${opcionId}`, "DELETE");


        const updatedProductsDelete = productsList.map((p) => {
          if (p.id === itemId) {
            return {
              ...p,
              opciones: p.opciones ? p.opciones.filter((o) => o.id !== opcionId) : []
            }
          }
          return p;
        })

        initProductList(updatedProductsDelete)



        SwalNotification.fire({
          title: "Completado!",
          icon: "success",
          text: "Opción eliminada correctamente",
          draggable: true
        });




      } catch (error) {
        SwalUnexpectedError.fire()
      }
    }

  }

  // Abrir detalles
  const getDetalles = (plato: Product) => {
    setsinglePlato(plato)
    setdetalle(true)

  }

  // Cerrar detalles
  const goBack = () => {
    setdetalle(false)
  }



  return (
    <>
      <div>
        {/* Boton de agregar producto */}
        <div className="addProduct" onClick={() => handleAddFields(emptyProduct)}>
          <h1>Agregar Productos</h1>
        </div>

        {/* Lista de productos */}

        <div className="itemContainer">
          {detalle

            ? (/// HTML del producto único
              <div className="singleItem">
                <h1>{singlePlato?.nombre}</h1>
                <h3>{singlePlato?.descripcion}</h3>
                <h2>${singlePlato?.precio}</h2>
                <img src={singlePlato?.imagen} alt={singlePlato?.nombre} />
                {singlePlato?.opciones?.map((opc, index) => (
                  <li key={index} className="option-li">
                    {opc.precio && <p>Precio extra: ${opc.precio}</p>}
                    <span>{opc.nombre}</span>
                    <div className="actions">
                      <button className="item-card-btn-danger"
                        onClick={() => deleteOption(singlePlato.categoriaId, singlePlato.id, opc.id)}>
                        <FontAwesomeIcon icon={faTrashCan}></FontAwesomeIcon>
                      </button>
                    </div>
                  </li>
                ))}

                <button onClick={goBack} className='volverBtn'>Volver</button>

              </div>
            )

            // ---------------------------------------------------
            : (
              /// HTML de la lista de productos
              productsList.map((item) => (
                // Tarjetas
                <div key={item.id} className="item-card">
                  <h3>{item.nombre}</h3>
                  <p className="item-desc">{item.descripcion}</p>
                  <p className="item-price"> <FontAwesomeIcon icon={faDollarSign}></FontAwesomeIcon> {item.precio}</p>
                  {/* <p>Precio de Descuento: ${item.precioDescuento}</p> */}
                  <img src={item.imagen} alt={item.nombre} onClick={() => getDetalles(item)} />

                  
                  
                  {/* Botones de edición. No se ven cuando se toca "Agregar opción" */}
                  {activeOptionFormId != item.id && (
                    <>
                      <button className="item-card-btn" onClick={() => setActiveOptionFormId(activeOptionFormId === item.id ? null : item.id)}>Agregar opción</button>
                      <button className="item-card-btn" onClick={() => handleEditFields(item)}>Editar</button>
                      <button className="item-card-btn-danger" onClick={() => handleDeleteItem(item.id, item.categoriaId)}>Eliminar</button>
                    </>
                  )}

                  {/* Formulario para agregar opción */}
                  {activeOptionFormId === item.id && (
                    
                    <div>
                      <button className="item-card-btn-danger" onClick={() => setActiveOptionFormId(activeOptionFormId === item.id ? null : item.id)}>Cerrar</button>
                      <input
                        className="item-card-input"
                        type="text"
                        placeholder="Nombre de la opción"
                        autoFocus
                        value={optionName}
                        onChange={(e) => setOptionName(e.target.value)}
                      />
                      <input
                        className="item-card-input"
                        type="number"
                        placeholder="Precio extra (opcional)"
                        value={optionExtraPrice}
                        onChange={(e) => setOptionExtraPrice(Number(e.target.value))}
                      />
                      <button
                        className="item-card-btn"
                        onClick={() => handleAddOption(item.id)}>Guardar opción</button>
                    </div>
                  )}
                </div>
              ))
            )}
        </div>
      </div>
    </>
  );
};

































