import type { Pedido } from "../../assets/types/types"
import { usePedidos } from "../../contexts/PedidoContext"
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
                    <th>Id</th>
                    <th>Fecha</th>
                    <th>Cliente</th>
                    <th>Telefono</th>
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
    const {OrderStorage} = usePedidos()
    return (
        <>
            <tr>
                <td>{order.id}</td>
                <td className="date-cell">{dateFormater(order.fecha)}</td>
                <td className="client-cell">{order.cliente.nombre}</td>
                <td>{order.cliente.telefono}</td>
                <td className="state-cell">{order.state.name}</td>
                <td className="price-cell">$ {order.total}</td>
                <td className="actions-cell"><button
                    onClick={() => OrderStorage.setArchivate(order, false)}>{">"}</button></td>
            </tr>
        </>
    )
}