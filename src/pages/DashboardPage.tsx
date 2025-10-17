// Librerias
import { useState } from "react";
import Swal from 'sweetalert2'
//Helpers
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// Contextos
import { useProductsStorage } from "../contexts/ProductsContext";
import { emptyProduct, usePopUpDispatch } from "../contexts/PopUpContext";
// Tipos y Estilos
import type { Product, ProductOption } from "../assets/types/types";
import '../assets/styles/dashboardStyles.css'
import { Notifications } from "../utils/swalNotification";
import { faTrashCan, faDollarSign } from '@fortawesome/free-solid-svg-icons'; // Example icons



export const Dashboard = () => {
  // Contextos
  const { productsList, ProductStorage } = useProductsStorage()
  const { handleIsVisible, handleIsEditing, handleFormData, handleFormType } = usePopUpDispatch()

  const [detalle, setdetalle] = useState<Boolean>(false)
  const [singlePlato, setsinglePlato] = useState<Product | null>(null)

  // Estados para agregar opción
  const [activeOptionFormId, setActiveOptionFormId] = useState<string | null>(null);
  const [optionName, setOptionName] = useState("");
  const [optionExtraPrice, setOptionExtraPrice] = useState<number | undefined>()


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
  const handleAddOption = async (product: Product) => {
    if (!optionName) {
      Notifications.fireError("El nombre de la opcion es obligatorio!");
      return;
    }

    const newOption: ProductOption = {
      id: "",
      nombre: optionName,
      precio: optionExtraPrice
    };


    ProductStorage.addOption(product, newOption)

    setOptionName("");
    setOptionExtraPrice(undefined);
    setActiveOptionFormId(null);

  };

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
                        onClick={() => ProductStorage.deleteOption(singlePlato, opc.id)}>
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
                  <h3>
                    {item.nombre} 
                    
                  </h3>
                  <p className="item-desc">
                    {item.descripcion}

                    {item.esVisible ?
                    <button onClick={() => {ProductStorage.edit({...item, esVisible: !item.esVisible})}}>O</button>
                    : 
                    <button onClick={() => {ProductStorage.edit({...item, esVisible: !item.esVisible})}}>-</button>
                  }
                    
                  </p>
                  <p className="item-price"> <FontAwesomeIcon icon={faDollarSign}></FontAwesomeIcon> {item.precio}</p>
                  {/* <p>Precio de Descuento: ${item.precioDescuento}</p> */}
                  <img src={item.imagen} alt={item.nombre} onClick={() => getDetalles(item)} />



                  {/* Botones de edición. No se ven cuando se toca "Agregar opción" */}
                  {activeOptionFormId != item.id && (
                    <>
                      <button className="item-card-btn" onClick={() => setActiveOptionFormId(activeOptionFormId === item.id ? null : item.id)}>Agregar opción</button>
                      <button className="item-card-btn" onClick={() => handleEditFields(item)}>Editar</button>
                      <button className="item-card-btn-danger" onClick={() => ProductStorage.delete(item.id, item.categoriaId)}>Eliminar</button>
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
                        onClick={() => handleAddOption(item)}>Guardar opción</button>
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

































