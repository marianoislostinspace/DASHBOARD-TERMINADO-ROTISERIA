// Librerias
import { Link } from "react-router"
import { useState } from "react"
import { Tooltip } from 'bootstrap'
// Contexts
import { usePedidos } from "../contexts/PedidoContext"
import { useNavBar } from "../contexts/NavbarContext"
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

  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
  const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new Tooltip(tooltipTriggerEl))

  return (
    <nav className="navbar navbar-expand fixed-top">
      <div className="container-fluid">

        <a className="navbar-brand me-5">
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

  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
  const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new Tooltip(tooltipTriggerEl))

  return (
    <div className="icon-sidebar">
      <div className="links-container">

        <Link className="nav-link" to="/pedidos" 
          data-bs-toggle="tooltip" data-bs-placement="right"
          data-bs-title="Pedidos">
          <FontAwesomeIcon className="nav-icon-color" icon={faReceipt}></FontAwesomeIcon>
        </Link>

        <Link className="nav-link" to="/dashboard" 
          data-bs-toggle="tooltip" data-bs-placement="right"
          data-bs-title="Productos">
          <FontAwesomeIcon className="nav-icon-color" icon={faBoxOpen}></FontAwesomeIcon>
        </Link>




        <Link className="nav-link" to="/categories" 
          data-bs-toggle="tooltip" data-bs-placement="right"
          data-bs-title="Categorias" >
          <FontAwesomeIcon className="nav-icon-color" icon={faLayerGroup}></FontAwesomeIcon>
        </Link>




        <Link className="nav-link" to="/historial" 
          data-bs-toggle="tooltip" data-bs-placement="right"
          data-bs-title="Historial">
          <FontAwesomeIcon className="nav-icon-color" icon={faReceipt}></FontAwesomeIcon>
        </Link>


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