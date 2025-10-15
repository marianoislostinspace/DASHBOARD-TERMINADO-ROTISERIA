import type { Pedido } from "../../assets/types/types"
import "../../assets/styles/ordersHistorial.css"
interface Props {
    filteredOrders: Pedido[]
}

export const OrdersTable = ({ filteredOrders }: Props) => {

    // Turns the awful date number into a more readable format
    const getFormatedDate = (date: number) => {
        const formatedDate = new Date(date)

        return formatedDate.getDate() + "/" + formatedDate.getMonth() + "/" + formatedDate.getFullYear()
    }

    return (
        <table>
            <thead>
                <tr>
                    <th>Fecha</th>
                    <th>Cliente</th>
                    <th>Estado</th>
                    <th>Total</th>
                    <th>Acciones</th>
                </tr>
            </thead>

            <tbody>
                {filteredOrders.map((order) => <ContentRow key={order.id} order={order} dateFormater={getFormatedDate} />)}
            </tbody>
        </table>
    )
}

interface ContentRowProps {
    order: Pedido,
    dateFormater: (date: number) => string
}

const ContentRow = ({ order, dateFormater }: ContentRowProps) => {
    return (
        <>
            <tr>
                <td className="date-cell">{dateFormater(order.fecha)}</td>
                <td className="client-cell">{order.cliente.nombre}</td>
                <td className="state-cell">{order.state.name}</td>
                <td className="price-cell">$ {order.total}</td>
                <td className="actions-cell">Boton</td>
            </tr>
        </>
    )
}