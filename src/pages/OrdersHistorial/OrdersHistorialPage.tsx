// Context
import { usePedidos } from "../../contexts/PedidoContext"
// Compoents
import { OrdersTable } from "./OrdersTable"
// Types and Styles
import "../../assets/styles/ordersHistorial.css"
import type { Pedido, OrderItem } from "../../assets/types/types"

export const OrdersHistorial = () => {
  const {pedidos} = usePedidos()

  return (
    <>
      <OrdersTable filteredOrders={pedidos}></OrdersTable>
    </>
  )
}
