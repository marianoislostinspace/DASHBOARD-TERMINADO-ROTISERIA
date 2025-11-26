import { OverlayTooltip } from "../../components/UI/OverlayTooltip"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus } from "@fortawesome/free-solid-svg-icons"

export const DashboardButtons = (p: { onClickFunction: () => void }) => {

  return (
    <>

      <OverlayTooltip key="dashAddBtn" placement="bottom"
        text="Agrega un producto">

        <button onClick={p.onClickFunction}>
          <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
        </button>
      </OverlayTooltip>


    </>)
}