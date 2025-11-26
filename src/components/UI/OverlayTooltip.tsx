import { ReactElement } from "react"
import Tooltip from "react-bootstrap/Tooltip"
import OverlayTrigger from "react-bootstrap/OverlayTrigger"

interface Props {
  children : ReactElement,
  key: string,
  placement: "top" | "bottom" | "right" | "left"
  text: string 
}


export const OverlayTooltip = ({children, key, placement, text} : Props) => {
  return (
    <OverlayTrigger
          key={key}
          placement={placement}
          overlay={
            <Tooltip>
              {text}
            </Tooltip>
          }>
        {children}
    </OverlayTrigger>
    
  )
}
