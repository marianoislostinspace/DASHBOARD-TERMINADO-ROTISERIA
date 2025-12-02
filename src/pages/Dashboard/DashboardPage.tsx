// Librerias
import { useEffect, useState } from "react";
//Helpers
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// Componentes
import { DashboardButtons } from "./DashboardButtons";
import { ProductCard } from "./ProductCard";
import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"
import Container from "react-bootstrap/Container"
// Contextos
import { useProductsStorage } from "../../contexts/ProductsContext";
import { emptyProduct, usePopUpDispatch } from "../../contexts/PopUpContext";
import { useNavBar } from "../../contexts/NavbarContext";
// Tipos y Estilos
import type { Product, ProductOption } from "../../assets/types/types";
import '../../assets/styles/dashboardStyles.css'
import { Notifications } from "../../utils/swalNotification";
import { faTrashCan, faDollarSign, faEye, faEyeSlash, faPlus } from '@fortawesome/free-solid-svg-icons'; // Example icons



export const Dashboard = () => {
  // Contextos
  const { productsList, ProductStorage } = useProductsStorage()
  const { handleIsVisible, handleIsEditing, handleFormData, handleFormType } = usePopUpDispatch()
  const { setButtons } = useNavBar()

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
  const handleAddFields = () => {
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

  useEffect(() => {
    setButtons(DashboardButtons({ onClickFunction: handleAddFields }))

    return () => {
      setButtons(<></>)
    }
  }, [])

  return (
    <>
      <Container fluid="sm" >
        {
          detalle ?
            // HTML del producto único
            (
              <div className="itemContainer" >
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
              </div>
            )

            // ---------------------------------------------------

            : /// HTML de la lista de productos      
            (
              <Row className="justify-content-center pt-3" xs={"auto"}>
              {productsList.map((item, index) => (
    
                <Col className="justify-content-center mb-3" style={{ display: "flex" }}>
                  <ProductCard item={item}></ProductCard>
                </Col>
              
            ))}
            </Row>
            )

        }
      </Container >


    </>
  );
};

































