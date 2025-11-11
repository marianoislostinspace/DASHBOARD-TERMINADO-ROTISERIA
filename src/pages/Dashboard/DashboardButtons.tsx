import { Tooltip } from "bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus } from "@fortawesome/free-solid-svg-icons"

export const DashboardButtons = (p : {onClickFunction : () => void}) => {
  
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
  const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new Tooltip(tooltipTriggerEl))
  
  return (
  <>
    
      <button 
        data-bs-toggle="tooltip" data-bs-placement="bottom"
        
        data-bs-title="Agregar Productos" onClick={p.onClickFunction}>
        <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
      </button>
    
  </>)
}