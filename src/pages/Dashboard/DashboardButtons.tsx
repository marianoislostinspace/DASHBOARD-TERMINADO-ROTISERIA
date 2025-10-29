import { Tooltip } from "@mui/material"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus } from "@fortawesome/free-solid-svg-icons"

export const DashboardButtons = (p : {onClickFunction : () => void}) => {
  return (
  <>
    <Tooltip title="Agregar producto">
      <button onClick={p.onClickFunction}>
        <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
      </button>
    </Tooltip>
  </>)
}