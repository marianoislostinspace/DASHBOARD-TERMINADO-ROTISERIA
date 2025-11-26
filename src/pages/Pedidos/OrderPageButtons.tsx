import { OverlayTooltip } from "../../components/UI/OverlayTooltip"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCoffee, faPlus } from "@fortawesome/free-solid-svg-icons"

export const OrderPageButtons = (p: { onClickFunction: () => void }) => {


  return (
    <>

      <OverlayTooltip key="ordersAddBtn" placement="bottom"
        text="Crear un pedido">

        <button className="nav-item">
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </OverlayTooltip>


      <OverlayTooltip key="ordersAddBtn" placement="bottom"
        text="Pedir un cafe">

        <button className="nav-item">
          <FontAwesomeIcon icon={faCoffee} />
        </button>
      </OverlayTooltip>

    </>
  )
}