import { createContext, useState, useContext, useEffect, useReducer } from "react";
import { io, Socket } from "socket.io-client";
import type { Pedido } from "../assets/types/types";
import { State, stateList } from "../hooks/useStateManager";
import { OrdersDB } from "../utils/DataBase";
import { SwalNotification, SwalUnexpectedError } from "../utils/swalNotification";

type PedidoContextType = {
  pedidos: Pedido[];
  newOrdersCounter: number;
  resetNewOrdersCounter: () => void
  OrdersStorage: {
    add: (order: Pedido) => void,
    editState: (order: Pedido, state: State) => void,
    delete: (orderId: string) => void,
    reset: () => void
  }
/*  agregarPedido: (pedido: Pedido) => void;
  eliminarPedido: (id: string) => void;
  nuevosPedidos: number;
  resetPedidos: () => void;
  changeState: (order: Pedido, state: State) => void;
  initOrderStates: () => void;
*/
};

const PedidoContext = createContext<PedidoContextType | undefined>(undefined);

// ---------------------------- Reducer -------------------------

type Action =
  | { type: "INITIALIZE", payload: Pedido[] }
  | { type: "ADD", payload: Pedido }
  | { type: "EDIT STATE", payload: { order: Pedido, state: State } }
  | { type: "DELETE", payload: string }
  | { type: "RESET" }

const ordersReducer = (initialState: Pedido[], action: Action): Pedido[] => {
  switch (action.type) {
    case "INITIALIZE": // Socket - Fetch 
      return action.payload
    case "ADD": // No se usa ADD en 
      return [...initialState, action.payload]
    case "EDIT STATE":
      const data = initialState.map((o) => {
      if (o.id === action.payload.order.id) {
        o.state = action.payload.state
      }
      return o
    })

    OrdersDB.edit(action.payload.order.id, action.payload.order)
    
      return data
    case "DELETE":
      // Backend's delete
      OrdersDB.delete(action.payload)
      
      return initialState.filter((p) => p.id !== action.payload)
    case "RESET":
      return []
  }
}

export const PedidoProvider = ({ children }: { children: React.ReactNode }) => {

  const API_URL = import.meta.env.VITE_API_URL;

  const [pedidos, dispatch] = useReducer(ordersReducer, []);

  const OrdersStorage = {
    add: (order: Pedido) => dispatch({type: "ADD", payload: order}),
    reset: () => dispatch({type: "RESET"}),
    delete: (orderId: string) => dispatch({type: "DELETE", payload: orderId}),
    editState: (order: Pedido, state: State) => dispatch({type: "EDIT STATE", payload: {order, state}})
  }

  const [newOrdersCounter, setnewOrdersCounter] = useState(0);
  const resetNewOrdersCounter = () => setnewOrdersCounter(0);

  // Fetch que trae todos los pedidos de la base de datos.
  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          SwalUnexpectedError.fire("No hay token en localStorage");
          return;
        }

        const response = await fetch(`${API_URL}/pedidos`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Error al traer pedidos");
        }

        const data = await response.json();


        if (Array.isArray(data)) {
          
          // Se asegura que cada pedido tiene un estado asignado
          data.forEach((order) => {
            if (!order.state) {
              order.state = stateList[0]
            }
          })

          dispatch({
            type: "INITIALIZE",
            payload: data
          })

        } else {
          console.warn("La API devolvió un objeto en vez de un array:", data);
          dispatch({
            type: "INITIALIZE",
            payload: []
          })
        }

        console.log("📦 Pedidos cargados:", data);

      } catch (err: any) {
        SwalUnexpectedError.fire(err.message);
      }
    };

    fetchPedidos();
  }, [API_URL]);

  // Socket de recepción de nuevos pedidos. Se llama cada vez
  // que se genera un nuevo pedido en la base de datos.
  useEffect(() => {
    const socket: Socket = io(import.meta.env.VITE_API_URL);
    const notification = new Audio("/audio/notification.mp3");

    socket.on("nuevo-pedido", (pedido: Pedido) => {
      // Feedback del nuevo ingreso
      console.log("📦 Nuevo pedido recibido:", pedido);
      SwalNotification.fire({
        title: '📦 Nuevo pedido recibido',
        text: `Cliente: ${pedido.cliente.nombre}`,
        icon: 'info'
      });
      notification.play();

      // Lógica de recepción
      if (!pedido.state) {
        pedido.state = stateList[0]
      }
      
      dispatch({type: "ADD", payload: pedido});
      setnewOrdersCounter((prev) => prev + 1);
    });


    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <PedidoContext.Provider
      value={{ pedidos, OrdersStorage, newOrdersCounter, resetNewOrdersCounter}}
    >
      {children}
    </PedidoContext.Provider>
  );
};

export const usePedidos = () => {
  const ctx = useContext(PedidoContext);
  if (!ctx) throw new Error("usePedidos debe usarse dentro de PedidoProvider");
  return ctx;
};
