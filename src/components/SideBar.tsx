import "../assets/styles/sidebar.css"
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
              <Link  className="nav-link" to="/pedidos">Pedidos Entrantes</Link>
            </li>
            <li onClick={() => sectionNameSetter("Productos")}>
              <Link  className="nav-link" to="/dashboard">Productos en venta y Stock</Link>
            </li>
            <li onClick={() => sectionNameSetter("Categorias")}>
              <Link  className="nav-link" to="/categories">Crear Categorias</Link>
            </li>
          </ul>
          </div>
        </nav>
  )
}
