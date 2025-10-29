import { createContext, useContext } from "react"

interface NavbarContext {
    buttons : React.ReactNode,
    setButtons : React.ReactNode
}

export const NavbarContext = createContext(undefined)

export const NavbarProvider = ({childen} : {childen : React.ReactNode}) => {

  return (
    <NavbarContext.Provider value={undefined}>
        {childen}
    </NavbarContext.Provider>
  )
}


export const useNavBar = () => {
  const ctx = useContext(NavbarContext);
  if (!ctx) throw new Error("useNavbar debe usarse dentro de PedidoProvider");
  return ctx;
} 
