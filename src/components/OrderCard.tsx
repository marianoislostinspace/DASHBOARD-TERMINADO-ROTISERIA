// Librerias
import { useState } from "react"
import Swal from "sweetalert2"
// Context
import { usePedidos } from "../contexts/PedidoContext"
// Utils
import { OrdersDB } from "../utils/DataBase"
import { SwalNotification, SwalUnexpectedError } from "../utils/swalNotification"
// Assets
import { swalThemeConfig } from "../assets/ThemeData"
import type { Pedido } from "../assets/types/types"
import "../assets/styles/orderCard.css" 

type Props = {
    order: Pedido
}
type OrderState = "new" | "on preparation" | "done" | "canceled"

export const OrderCard = ({order} : Props) => {

    const [orderState, setOrderState] = useState<OrderState>("new")
    const {eliminarPedido} = usePedidos()


    const changeState = (id: string, state: OrderState) => {
        setOrderState(state)
    }

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
                borderLeftColor:
                    orderState === 'done' ? '#7bff00' :
                        orderState === 'on preparation' ? '#ff9900' :
                            orderState === 'canceled' ? '#ff0000' :
                                ''
            }}
        >
            Ingreso: {new Date(order.fecha).toLocaleString()}
            <br />
            Cliente: {order.cliente.nombre}
            <br />
            Telefono: 📞  {order.cliente.telefono}
            <br />
            Pedido:
            <div className='pedidoSubContainer'>
                 {order.items?.map((item) => (
                    <div>
                        <h1>{item.nombre} - x{item.cantidad}</h1>
                        {item.opcionesSeleccionadas && item.opcionesSeleccionadas?.map((opc) => (
                            <ul key={opc.id} className='opciones'>
                                <li>{opc.nombre} : {opc.precioExtra}</li>
                            </ul>
                        ))}
                    </div>
                ))}
                <h1>TOTAL: 🧾 ${order.total}</h1>
            </div>
            
            <div className='estadoButtondiv'>
                <button className='pedido-btn'
                    onClick={() => changeState(order.id, 'on preparation')}>Preparando</button>
                <button className='pedido-btn'
                    onClick={() => changeState(order.id, 'done')}>Listo</button>
                <button className='pedido-btn'
                    onClick={() => changeState(order.id, 'canceled')}>Cancelado</button>
            </div>

            <button className='pedido-delete' onClick={() => deleteOrder(order.id)}>Eliminar pedido</button>

        </div>
    )
}






