import { useState, createContext, useContext } from "react"

interface NavbarContext {
    buttonsBar : React.ReactNode,
    setButtons : (value: React.ReactNode) => void
}

export const NavbarContext = createContext<NavbarContext | undefined>(undefined)

export const NavbarProvider = ({children} : {children : React.ReactNode}) => {

  const [buttonsBar, setButtonsBarr] = useState<React.ReactNode>()

  function setButtons(value: React.ReactNode){
    
    setButtonsBarr(value)
  }

  return (
    <NavbarContext.Provider value={{buttonsBar, setButtons}}>
        {children}
    </NavbarContext.Provider>
  )
}


export const useNavBar = () => {
  const ctx = useContext(NavbarContext);
  if (!ctx) throw new Error("useNavbar debe usarse dentro de PedidoProvider");
  return ctx;
} 
