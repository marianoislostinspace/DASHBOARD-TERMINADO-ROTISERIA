import type { OrderItem, Pedido } from "../../assets/types/types"
import { stateList } from "../../hooks/useStateManager"


// Usado para hacer testing desde dashboard.
export const createTestOrder = () => {
    
    let order = {
        id: "",
        cliente: { nombre: "Testeo", telefono: 12345678 },
        items: [],
        total: 500000,
        fecha: new Date().getTime(),
        state: stateList[0],
        estaArchivado: false
    }
    
    return order
}