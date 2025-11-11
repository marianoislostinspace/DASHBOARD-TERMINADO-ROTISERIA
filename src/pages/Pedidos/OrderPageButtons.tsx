import { faCoffee, faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Tooltip } from "@mui/material"

export const OrderPageButtons = () => {
  return (
    <>
      <Tooltip title="Agregar pedido nuevo">
        <button className="nav-item">
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </Tooltip>

      <Tooltip title="Pedir cafe">
        <button className="nav-item">
          <FontAwesomeIcon icon={faCoffee} />
        </button>
      </Tooltip>
    </>
  )
}