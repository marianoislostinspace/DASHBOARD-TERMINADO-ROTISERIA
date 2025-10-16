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
  OrderStorage: React.ActionDispatch<[action: Action]>
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
    case "INITIALIZE":
      // Se usa en el Fetch inicial 
      return action.payload

    case "ADD":
      // Se usa en el socket al recibir un pedido. La base de datos la actualiza el backend.
      return [...initialState, action.payload]
      
    case "EDIT STATE":
      // Edita el objeto correspondiente en el estado.
      const data = initialState.map((o) => {
        if (o.id === action.payload.order.id) {
          o.state = action.payload.state
        }
        return o
      })

      try {
        // Actualiza la base de datos.
        OrdersDB.edit(action.payload.order.id, action.payload.order)

        // Devuelve el estado actualizado al reducer.
        return data

      } catch (error) {
        // Falló al actualizar la base de datos
        SwalUnexpectedError.fire("Hubo un error al actualizar el item")

        return initialState
      }
      
    case "DELETE":
      try {
        // Backend's delete
        OrdersDB.delete(action.payload)

        // Devuelve el estado actualizado al reducer.
        return initialState.filter((p) => p.id !== action.payload)
      } catch (error) {
        // Falló al actualizar la base de datos
        SwalUnexpectedError.fire("Hubo un error al eliminar el item")

        return initialState
      }
      
    case "RESET":
      return []
  }
}

export const PedidoProvider = ({ children }: { children: React.ReactNode }) => {

  const API_URL = import.meta.env.VITE_API_URL;

  const [pedidos, OrderStorage] = useReducer(ordersReducer, []);

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

          OrderStorage({
            type: "INITIALIZE",
            payload: data
          })

        } else {
          console.warn("La API devolvió un objeto en vez de un array:", data);
          OrderStorage({
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

      OrderStorage({ type: "ADD", payload: pedido });
      setnewOrdersCounter((prev) => prev + 1);
    });


    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <PedidoContext.Provider
      value={{ pedidos, OrderStorage, newOrdersCounter, resetNewOrdersCounter }}
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
