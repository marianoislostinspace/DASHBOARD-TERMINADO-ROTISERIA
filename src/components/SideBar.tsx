import Swal from "sweetalert2"
import "../assets/styles/sidebar.css"
import { Link, useLocation } from "react-router"
import { useEffect, useState } from "react"


export const SideBar = () => {

  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleMenu = () => setIsNavOpen(prev => !prev);


  const location = useLocation()

  const tituloRutas: Record<string, string> = {
    '/pedidos': 'Pedidos Entrantes',
    '/dashboard': 'Productos en venta y stock',
    '/categories': 'Admnistrar Categorias',
    '/historial': 'Historial de Pedidos'
  }

  const tituloActivo = tituloRutas[location.pathname] || 'Pagina'



  const horarios = () => {
    Swal.fire({
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
      <nav className="navbar">
        <button className="hamburger" onClick={toggleMenu}>
          ☰
        </button>
        <div className="textoMEdio"><Link className="homeNav" to="/"><h1 className="textoMid">{tituloActivo}</h1></Link></div>
        <div className="logo">
          <img src="img/sapo.jpg" alt="Logo" />
        </div>


      </nav>

      <div className={`side-menu ${isNavOpen ? 'open' : ''}`}>
        <Link className="nav-link" to="/pedidos"><i className="fa-solid fa-receipt"></i>historial de pedidos</Link>

        <Link className="nav-link" to="/dashboard"><i className="fa-solid fa-box-open"></i>Productos en venta y Stock</Link>

        <Link className="nav-link" to="/categories"><i className="fa-solid fa-layer-group"></i>Crear Categorias</Link>

        <Link className="nav-link" to="/historial"><i className="fa-solid fa-receipt"></i>Pedidos entrantes</Link>



        <div className="rigthContainer">
          <h1>Cush Burguers Web Site</h1>
          <p>&copy; {año} Todos los derechos reservados. <br /></p>
        </div>

      </div>
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