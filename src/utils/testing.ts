import type { OrderItem, Pedido } from "../assets/types/types"
import { stateList } from "../hooks/useStateManager"
import { OrdersDB } from "./DataBase"


// Usado para hacer testing desde dashboard.
export const createTestOrder = () => {
    let order = {
        cliente: { nombre: "Testeo", telefono: 12345678 },
        items: [],
        total: 500000,
        fecha: new Date().toISOString(),
        state: stateList[0]
    }
    OrdersDB.add(order)
}