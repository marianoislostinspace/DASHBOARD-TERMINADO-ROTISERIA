// Componentes
import Card from "react-bootstrap/Card"
import Button from "react-bootstrap/Button"
// Contextos
import { useProductsStorage } from '../../contexts/ProductsContext'
// Utils
import { formatPrice } from "../../utils/formatPrice"
import { createRangeArray } from "../../utils/createRangeArray"
// Tipos y estilos
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash, faDollarSign, faTrash, faPen } from '@fortawesome/free-solid-svg-icons'
import { Product } from '../../assets/types/types'

interface Props {
  item: Product,
  onEdit: (item: Product) => void,
  onShowDetails?: () => void
}

export const ProductCard = ({ item, onEdit }: Props) => {
  const { ProductStorage } = useProductsStorage()
  return (
    <Card className="item-card">
      <Card.Header className="d-flex justify-content-between" >
        <div style={{ alignContent: "center" }}>
          {item.nombre}
        </div>

        <Button className="visibility-btn btn-dark"
          onClick={() => { ProductStorage.edit({ ...item, esVisible: !item.esVisible }) }}
        >
          {item.esVisible ?
            <FontAwesomeIcon icon={faEye} />
            : <FontAwesomeIcon icon={faEyeSlash} />
          }
        </Button>

      </Card.Header>
      <Card.Body>
        <Card.Subtitle className="item-price">{formatPrice(item.precio)}</Card.Subtitle>
        <Card.Img src={item.imagen}></Card.Img>
        <div className="btn-group">
          <Button className="btn-success" onClick={() => { onEdit(item) }}><FontAwesomeIcon icon={faPen} /></Button>
          <Button className="btn-danger"
            onClick={() => ProductStorage.delete(item.id, item.categoriaId)}>
            <FontAwesomeIcon icon={faTrash} />
          </Button>
        </div>

        {
          item.opciones.length < 6 &&
          createRangeArray(0, 4).map((value) => <>{
            value < item.opciones.length ?
              <div className="item-option d-flex justify-content-between w-100 mt-1 px-2   ">
                <span>{item.opciones[value].nombre}</span>
                <span>
                  {item.opciones[value].precio ?
                    formatPrice(item.opciones[value].precio)
                    : "$ 0,00"}
                </span>
              </div>
              : 
              <div className="item-option d-flex justify-content-between w-100 mt-1 px-2   ">
                <span>----------</span>
                <span>
                  {"$ 0,00"}
                </span>
              </div>
          }</>
          )
        }

      </Card.Body>
    </Card>)

}


export const OldProductCard = (item: Product) => {
  const { ProductStorage } = useProductsStorage()
  return (
    <div key={item.id} className="item-card">
      <h3>
        {item.nombre}

      </h3>
      <p className="item-desc">
        {item.descripcion}


        <button
          style={item.esVisible ? { backgroundColor: "green" } : { backgroundColor: "red" }}
          onClick={() => { ProductStorage.edit({ ...item, esVisible: !item.esVisible }) }}>
          {item.esVisible ?
            <FontAwesomeIcon icon={faEye}></FontAwesomeIcon>
            :
            <FontAwesomeIcon icon={faEyeSlash}></FontAwesomeIcon>
          }
        </button>


      </p>
      <p className="item-price"> <FontAwesomeIcon icon={faDollarSign}></FontAwesomeIcon> {item.precio}</p>
      {/* <p>Precio de Descuento: ${item.precioDescuento}</p> */}
      {/* <img src={item.imagen} alt={item.nombre} onClick={() => getDetalles(item)} /> */}



      {/* Botones de edición. No se ven cuando se toca "Agregar opción" */}
      {/* {activeOptionFormId != item.id && (
                    <>
                      <button className="item-card-btn" onClick={() => setActiveOptionFormId(activeOptionFormId === item.id ? null : item.id)}>Agregar opción</button>
                      <button className="item-card-btn" onClick={() => handleEditFields(item)}>Editar</button>
                      <button className="item-card-btn-danger" onClick={() => ProductStorage.delete(item.id, item.categoriaId)}>Eliminar</button>
                    </>
                  )} */}

      {/* Formulario para agregar opción */}
      {/* {activeOptionFormId === item.id && (

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
                  )} */}
    </div>
  )
}

