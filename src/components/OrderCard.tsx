// Librerias
import Swal from "sweetalert2"
// Context
import { usePedidos } from "../contexts/PedidoContext"
// Utils
import { OrdersDB } from "../utils/DataBase"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { SwalNotification, SwalUnexpectedError } from "../utils/swalNotification"
// Assets
import { swalThemeConfig } from "../assets/ThemeData"
import type { Pedido } from "../assets/types/types"
import "../assets/styles/orderCard.css"
import { faPhone, faUserCircle, faDollarSign, faNoteSticky } from "@fortawesome/free-solid-svg-icons"
import { stateList } from "../hooks/useStateManager"

type Props = {
    order: Pedido
}

export const OrderCard = ({ order }: Props) => {

    const { OrdersStorage } = usePedidos()

    const deleteOrder = async (id: string) => {
        // Confirmation notification
        const result = await Swal.fire({
            ...swalThemeConfig,
            title: "¿Estás seguro que quieres eliminar este pedido?",
            text: "¡No hay vuelta atrás!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar"
        });
        if (!result.isConfirmed) {
            return
        }

        // Deletion
        try {
            // Storage update
            OrdersStorage.delete(id)

            // Feedback
            SwalNotification.fire({
                title: "Completado!",
                icon: "success",
                text: "pedido eliminado con exito",
                draggable: true
            });
        } catch (error) {
            SwalUnexpectedError.fire({
                title: (error as Error).name
            })
        }
    }

    return (
        <div className='container pedido'
            style={{
                borderTopColor: order.state.color
            }}
        >
            <div className='estadoButtondiv'>
                <select name="state" id="stateSelect"
                    style={{ backgroundColor: order.state.color }}
                    onChange={(e) => OrdersStorage.editState(order, stateList[parseInt(e.target.value)])}
                    value={order.state._id}>

                    {stateList.map((state) => {
                        return <option
                            value={state.getId()}
                            key={state.getId()}
                            // selected={order.state._id === state._id}
                            style={{ backgroundColor: state.color }}
                        >{state.toString()}</option>
                    })}

                </select>
            </div>

            <FontAwesomeIcon icon={faUserCircle}></FontAwesomeIcon> {order.cliente.nombre}
            <br />
            <FontAwesomeIcon icon={faPhone}></FontAwesomeIcon>  {order.cliente.telefono}


            <div className='pedidoSubContainer'>
                <div className="order-items">
                    {order.items?.map((item) => (
                        <div key={order.id}>
                            <h1><b>{item.nombre} - x{item.cantidad}</b></h1>

                            {item.opcionesSeleccionadas &&
                                <ul className='opciones'>

                                    {item.opcionesSeleccionadas?.map((opc) => {
                                        return <li key={opc.id}><b>{opc.nombre.trim()}</b></li>
                                    })}

                                </ul>}
                            {item.nota &&
                                <h1 className="order-item-note">
                                    <b>
                                        <FontAwesomeIcon icon={faNoteSticky}></FontAwesomeIcon>
                                        {item.nota}
                                    </b>
                                </h1>}
                        </div>
                    ))}
                </div>

                <h1>
                    ---------------------------
                    <br />
                    <FontAwesomeIcon icon={faDollarSign}></FontAwesomeIcon>{order.total}
                </h1>
            </div>




            <button className='pedido-delete' onClick={() => deleteOrder(order.id)}>Eliminar pedido</button>

            <p className="order-date">{new Date(order.fecha).toLocaleString()}</p>
        </div>
    )
}






