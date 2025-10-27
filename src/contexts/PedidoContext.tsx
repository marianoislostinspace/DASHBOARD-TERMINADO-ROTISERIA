import { createContext, useState, useContext, useEffect, useReducer } from "react";
import { io, Socket } from "socket.io-client";
import type { Pedido, Product } from "../assets/types/types";
import { State, stateList } from "../hooks/useStateManager";
import { OrdersDB } from "../utils/DataBase";
import { SwalNotification, Notifications } from "../utils/swalNotification";
import { genericReducer } from "../utils/genericReduser";
import { handleBackendError } from "../assets/errors";

type PedidoContextType = {
  pedidos: Pedido[];
  newOrdersCounter: number;
  resetNewOrdersCounter: () => void
  OrderStorage: {
      add: (order: Pedido) => void,
      editState: (order: Pedido, newState: State) => void,
      delete: (orderId: string) => void,
      initialize: (productList: Pedido[]) => void,
      setArchivate: (order: Pedido, value: boolean) => void
    }
};

const PedidoContext = createContext<PedidoContextType | undefined>(undefined);


export const PedidoProvider = ({ children }: { children: React.ReactNode }) => {
  const [pedidos, dispatch] = useReducer(genericReducer<Pedido>, []);

  const [newOrdersCounter, setnewOrdersCounter] = useState(0);
  const resetNewOrdersCounter = () => setnewOrdersCounter(0);

    const OrderStorage = {
      // Agrega un producto
      add: (newOrder: any) => {
        Notifications.fireLoading()
  
        OrdersDB.add(newOrder)
          .catch(handleBackendError)
        
      },
      // Edita un producto
      editState: (order: Pedido, newState: State) => {
        Notifications.fireLoading()
        
        order.state = newState

        OrdersDB.edit(order.id, order)
          .then(() => {
            dispatch({type: "EDIT", payload: {editedObject: order}})
            Notifications.fireSuccess()
          })
          .catch(handleBackendError)
        
      },
      // Elimina un producto
      delete: async (orderId: string) => {
        const result = await Notifications.getUserConfirmation()
        if (!result.isConfirmed) return 
        
        Notifications.fireLoading()
  
        OrdersDB.delete(orderId)
          .then(() => {
            console.log(orderId)
            
            dispatch({ type: "DELETE", payload: { objectId: orderId } })
  
            Notifications.fireSuccess()
          })
          .catch(handleBackendError)
      },
      setArchivate: (order: Pedido, value: boolean) => {
        Notifications.fireLoading()
        order.estaArchivado = value
        
        OrdersDB.edit(order.id, order)
          .then(() => {
            dispatch({type: "EDIT", payload: {editedObject: order}})
            Notifications.fireSuccess()
          })
          .catch(handleBackendError)
        

      },
      initialize: (productsList: Pedido[]) => dispatch({ type: "INITIALIZE", payload: productsList })
    }
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

      dispatch({type: "ADD", payload: {newObject: pedido}});
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
