// Librerias
import { Link } from "react-router"
import { useState } from "react"
// Contexts
import { usePedidos } from "../contexts/PedidoContext"
import { useNavBar } from "../contexts/NavbarContext"
// Utils
import { Tooltip } from "@mui/material"
// Styles
import "../assets/styles/sidebar.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBell, faReceipt, faBoxOpen, faLayerGroup, faBars, faPlus } from "@fortawesome/free-solid-svg-icons"



export const SideBar = (p: { onOpenStatusChange?: (isOpen: boolean) => void }) => {

  const { onOpenStatusChange } = p
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleMenu = () => {
    setIsNavOpen(prev => !prev)
    if (onOpenStatusChange) onOpenStatusChange(!isNavOpen)
  }

  return (
    <>

      <IconSideBar></IconSideBar>

    </>
  )
}




export const Navbar = () => {
  const { newOrdersCounter, resetNewOrdersCounter } = usePedidos()

  return (
    <nav className="navbar navbar-expand fixed-top">
      <div className="container-fluid">

        <a className="navbar-brand me-4">
          <img src="img/sapo.jpg" alt="Logo"
            width={52} height={52} style={{ borderRadius: "50%" }} />
        </a>


        <div className="collapse navbar-collapse">
          <form className="navbar-nav buttons-container">
            {useNavBar().buttonsBar}
          </form>
        </div>

        <div className="campana " onClick={resetNewOrdersCounter}>
          
          <FontAwesomeIcon icon={faBell} 
            style={{ color: "white" }}/>

          {newOrdersCounter > 0 && (
            <span className="badge">{newOrdersCounter}</span>
          )}

        </div>
      </div>
    </nav>
  )
}


const IconSideBar = () => {
  return (
    <div className="icon-sidebar">
      <div className="links-container">
        <Tooltip title="Pedidos">
          <Link className="nav-link" to="/pedidos">
            <FontAwesomeIcon className="nav-icon-color" icon={faReceipt}></FontAwesomeIcon>
          </Link>
        </Tooltip>

        <Tooltip title="Productos">
          <Link className="nav-link" to="/dashboard">
            <FontAwesomeIcon className="nav-icon-color" icon={faBoxOpen}></FontAwesomeIcon>
          </Link>
        </Tooltip>


        <Tooltip title="Categorias">
          <Link className="nav-link" to="/categories">
            <FontAwesomeIcon className="nav-icon-color" icon={faLayerGroup}></FontAwesomeIcon>
          </Link>
        </Tooltip>


        <Tooltip title="Historial">
          <Link className="nav-link" to="/historial">
            <FontAwesomeIcon className="nav-icon-color" icon={faReceipt}></FontAwesomeIcon>
          </Link>
        </Tooltip>

      </div>


    </div>
  )
}


const FullSideBar = (p: { isOpen: boolean, toggleMenu: () => void }) => {
  const { isOpen, toggleMenu } = p

  function close() {
    toggleMenu()
  }

  return (
    <>
      {
        isOpen
          ? <div className="sidebar-black-bg" onClick={close}></div>
          : <></>
      }


      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="buttons-container">
          <button className="hamburger" onClick={p.toggleMenu}>
            <FontAwesomeIcon icon={faBars}></FontAwesomeIcon>
          </button>
        </div>

        <div className="links-container">
          <Link className="nav-link" to="/pedidos" onClick={close}>
            <FontAwesomeIcon className="nav-icon-color" icon={faReceipt}></FontAwesomeIcon>
            Pedidos
          </Link>

          <Link className="nav-link" to="/dashboard" onClick={close}>
            <FontAwesomeIcon className="nav-icon-color" icon={faBoxOpen}></FontAwesomeIcon>
            Productos y Stock
          </Link>

          <Link className="nav-link" to="/categories" onClick={close}>
            <FontAwesomeIcon className="nav-icon-color" icon={faLayerGroup}></FontAwesomeIcon>
            Crear Categorias
          </Link>

          <Link className="nav-link" to="/historial" onClick={close}>
            <FontAwesomeIcon className="nav-icon-color" icon={faReceipt}></FontAwesomeIcon>
            Historial de Pedidos
          </Link>
        </div>



        {/* <div className="rigthsContainer">
          <h1>Cush Burguers Web Site</h1>
          <p>&copy; {año} Todos los derechos reservados. <br /></p>
        </div> */}

      </div>


    </>

  )
}