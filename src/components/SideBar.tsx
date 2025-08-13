import "../styles/navbar.css"
import { Link } from "react-router"

interface Props {
    sectionNameSetter: (a: string) => void
}
export const SideBar = ({sectionNameSetter}: Props) => {



  return (
    <nav className="navbar">
          <div className="nav-fill">
            <ul>
            <li onClick={() => sectionNameSetter("Pedidos")}>
              <Link to="/pedidos">Pedidos Entrantes</Link>
            </li>
            <li onClick={() => sectionNameSetter("Productos")}>
              <Link to="/dashboard">Productos en venta y Stock</Link>
            </li>
            <li onClick={() => sectionNameSetter("Categorias")}>
              <Link to="/categories">Crear Categorias</Link>
            </li>
            <li onClick={() => sectionNameSetter("Crear Productos")}>
              <Link to="/items">Agregar Productos</Link>
            </li>
            <li onClick={() => sectionNameSetter("Historial de Pedidos")}>
              <Link to="/historial">Historial de pedidos</Link>
            </li>
          </ul>
          </div>
        </nav>
  )
}
