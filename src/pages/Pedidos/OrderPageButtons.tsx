import { faCoffee, faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Tooltip } from "@mui/material"

export const OrderPageButtons = () => {
  return (
    <>
      <Tooltip title="Agregar pedido nuevo">
        <button>
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </Tooltip>

      <Tooltip title="Pedir cafe">
        <button >
          <FontAwesomeIcon icon={faCoffee} />
        </button>
      </Tooltip>
    </>
  )
}