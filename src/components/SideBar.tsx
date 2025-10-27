import Swal from "sweetalert2"
import "../assets/styles/sidebar.css"
import { Link, useLocation } from "react-router"
import { useEffect, useState } from "react"
import { usePedidos } from "../contexts/PedidoContext"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBell } from "@fortawesome/free-solid-svg-icons"
import { swalThemeConfig } from "../assets/ThemeData"
import { createTestOrder } from "../utils/__test__/createTestOrder"

interface prop {
  onOpenStatusChange?: (isOpen: boolean) => void
}

export const SideBar = ({ onOpenStatusChange }: prop) => {

  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleMenu = () => {
    setIsNavOpen(prev => !prev)
    if (onOpenStatusChange) onOpenStatusChange(!isNavOpen)
  }

  const { newOrdersCounter, resetNewOrdersCounter } = usePedidos()


  const location = useLocation()

  const tituloRutas: Record<string, string> = {
    '/pedidos': 'Pedidos Entrantes',
    '/dashboard': 'Productos y stock',
    '/categories': 'Admnistrar Categorias',
    '/historial': 'Historial de Pedidos'
  }

  const tituloActivo = tituloRutas[location.pathname] || 'Pagina'



  const horarios = () => {
    Swal.fire({
      ...swalThemeConfig,
      title: "🍔🍟",
      imageUrl: "img/horarios.png",
      imageWidth: 400,
      imageHeight: 650,
      imageAlt: "schedule image"
    });
  }


  const [año, setaño] = useState(2025)

  useEffect(() => {
    const añofunc = () => {
      const añoActual = new Date().getFullYear()
      setaño(añoActual)
    }
    añofunc()
  }, [])



  return (
    <>
      <div className={`side-menu ${isNavOpen ? 'open' : ''}`}>
        <Link className="nav-link" to="/pedidos"><i className="fa-solid fa-receipt"></i>Pedidos</Link>

        <Link className="nav-link" to="/dashboard"><i className="fa-solid fa-box-open"></i>Productos y Stock</Link>

        <Link className="nav-link" to="/categories"><i className="fa-solid fa-layer-group"></i>Crear Categorias</Link>

        <Link className="nav-link" to="/historial"><i className="fa-solid fa-receipt"></i>Historial de Pedidos</Link>



        <div className="rigthContainer">
          <h1>Cush Burguers Web Site</h1>
          <p>&copy; {año} Todos los derechos reservados. <br /></p>
        </div>

      </div>
      <nav className="navbar">
        <button className="hamburger" onClick={toggleMenu}>
          ☰
        </button>
        <button className="hamburger" onClick={createTestOrder}>
          +
        </button>
        <div className="textoMEdio">
          <Link className="homeNav" to="/">
            <h1 className="textoMid"></h1>
          </Link>
        </div>

        <div className="logo">
          <img src="img/sapo.jpg" alt="Logo" />

          <div className="campana" onClick={resetNewOrdersCounter}>
            <FontAwesomeIcon icon={faBell} style={{ color: "white" }}></FontAwesomeIcon>
            {newOrdersCounter > 0 && (
              <span className="badge">{newOrdersCounter}</span>
            )}
          </div>
        </div>


      </nav>


    </>
  )
}



{/* <li onClick={() => sectionNameSetter("Pedidos")}>
  <Link className="nav-link" to="/pedidos">Pedidos Entrantes</Link>
</li>
<li onClick={() => sectionNameSetter("Productos")}>
  <Link className="nav-link" to="/dashboard">Productos en venta y Stock</Link>
</li>
<li onClick={() => sectionNameSetter("Categorias")}>
  <Link className="nav-link" to="/categories">Crear Categorias</Link>
</li>
<li onClick={() => sectionNameSetter("historial de pedidos")}>
  <Link className="nav-link" to="/historial">historial de pedidos</Link>
</li> */}