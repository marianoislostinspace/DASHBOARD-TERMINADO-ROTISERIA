// Librerias
import { Link } from "react-router"
import { useState } from "react"
// Contexts
import { usePedidos } from "../contexts/PedidoContext"
import { useNavBar } from "../contexts/NavbarContext"
// Components
import { OverlayTooltip } from "./UI/OverlayTooltip"
// Styles
import "../assets/styles/sidebar.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBell, faReceipt, faBoxOpen, faLayerGroup, faBars } from "@fortawesome/free-solid-svg-icons"


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

        <a className="navbar-brand ms-2 me-3">
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
            style={{ color: "white" }} />

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

        <OverlayTooltip key="sidebarOrdersBtn" placement="right"
          text="Pedidos">

          <Link className="nav-link" to="/pedidos">
            <FontAwesomeIcon className="nav-icon-color" icon={faReceipt}></FontAwesomeIcon>
          </Link>
        </OverlayTooltip>

        <OverlayTooltip key="sidebarDashBtn" placement="right"
          text="Productos">

          <Link className="nav-link" to="/dashboard">
            <FontAwesomeIcon className="nav-icon-color" icon={faBoxOpen}></FontAwesomeIcon>
          </Link>
        </OverlayTooltip>


        <OverlayTooltip key="sidebarCategoryBtn" placement="right"
          text="Categorias">

          <Link className="nav-link" to="/categories">
            <FontAwesomeIcon className="nav-icon-color" icon={faLayerGroup}></FontAwesomeIcon>
          </Link>
        </OverlayTooltip>



        <OverlayTooltip key="sidebarHistoryBtn" placement="right"
          text="Historial">

          <Link className="nav-link" to="/historial">
            <FontAwesomeIcon className="nav-icon-color" icon={faReceipt}></FontAwesomeIcon>
          </Link>
        </OverlayTooltip>




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