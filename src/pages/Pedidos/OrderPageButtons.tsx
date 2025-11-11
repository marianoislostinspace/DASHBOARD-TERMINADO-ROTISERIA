import { faCoffee, faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export const OrderPageButtons = () => {
  

  return (
    <>

      <button className="nav-item"
        data-bs-toggle="tooltip" data-bs-placement="bottom"

        data-bs-title="Agregar Productos">
        <FontAwesomeIcon icon={faPlus} />
      </button>



      <button className="nav-item"
        data-bs-toggle="tooltip" data-bs-placement="bottom"

        data-bs-title="Pedir cafe">
        <FontAwesomeIcon icon={faCoffee} />
      </button>

    </>
  )
}