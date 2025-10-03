// Librerias
import { useState } from "react"
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
import { faPhone, faUserCircle, faDollarSign } from "@fortawesome/free-solid-svg-icons"
import { stateList } from "../hooks/useStateManager"

type Props = {
    order: Pedido
}

export const OrderCard = ({ order }: Props) => {

    const { eliminarPedido, changeState } = usePedidos()


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
            // Backend's delete
            OrdersDB.delete(id)

            // Local update
            eliminarPedido(id)

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
                borderLeftColor: order.state.color,
                borderTopColor: order.state.color
            }}
        >
            <div className='estadoButtondiv'>
                <select name="state" id="stateSelect" 
                    style={{backgroundColor: order.state.color}}
                    onChange={(e) => changeState(order, stateList[parseInt(e.target.value)])}>
                    {stateList.map((state) => {
                            return <option 
                                value={state.getId()} 
                                key={state.getId()} 
                                selected={order.state._id === state._id}
                                style={{backgroundColor: state.color}}
                                >{state.toString()}</option>
                    }) }
                </select>
                {/* <button className='pedido-btn'
                    onClick={() => changeState(order, stateList[1])}>Preparando</button>
                <button className='pedido-btn'
                    onClick={() => changeState(order, stateList[2])}>Listo</button>
                <button className='pedido-btn'
                    onClick={() => changeState(order, stateList[3])}>Cancelado</button> */}
            </div>

            <FontAwesomeIcon icon={faUserCircle}></FontAwesomeIcon> {order.cliente.nombre}
            <br />
            <FontAwesomeIcon icon={faPhone}></FontAwesomeIcon>  {order.cliente.telefono}


            <div className='pedidoSubContainer'>
                {order.items?.map((item) => (
                    <div key={order.id}>
                        <h1>{item.nombre} - x{item.cantidad}</h1>
                        {item.opcionesSeleccionadas && item.opcionesSeleccionadas?.map((opc) => (
                            <ul key={opc.id} className='opciones'>
                                <li>{opc.nombre} : {opc.precio}</li>
                            </ul>
                        ))}
                    </div>
                ))}
                <h1><FontAwesomeIcon icon={faDollarSign}></FontAwesomeIcon>{order.total}</h1>
            </div>

            
            

            <button className='pedido-delete' onClick={() => deleteOrder(order.id)}>Eliminar pedido</button>

            <p className="order-date">{new Date(order.fecha).toLocaleString()}</p>
        </div>
    )
}






