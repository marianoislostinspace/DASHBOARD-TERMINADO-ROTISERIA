import { createContext, useState, useContext, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import type { Pedido } from "../assets/types/types";
import { State, stateList } from "../hooks/useStateManager";
import { OrdersDB } from "../utils/DataBase";

type PedidoContextType = {
  pedidos: Pedido[];
  agregarPedido: (pedido: Pedido) => void;
  eliminarPedido: (id: string) => void;
  nuevosPedidos: number;
  resetPedidos: () => void;
  changeState: (order : Pedido, state: State) => void;
  initOrderStates: () => void;
};

const PedidoContext = createContext<PedidoContextType | undefined>(undefined);

export const PedidoProvider = ({ children }: { children: React.ReactNode }) => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [nuevosPedidos, setNuevosPedidos] = useState(0);

  const agregarPedido = (pedido: Pedido) => {
    setPedidos((prev) => {
      if (prev.some((p) => p.id === pedido.id)) return prev;
      return [...prev, pedido];
    });
  };

  const eliminarPedido = (id: string) => {
    setPedidos((prev) => prev.filter((p) => p.id !== id));
  };

  const changeState = (order : Pedido, state: State) => {
    const data = pedidos.map((o) => {
        if (o.id === order.id) {
          o.state = state
        }
        return order
      })
    let editedOrder : Pedido = order
    
    setPedidos(data)
    
    OrdersDB.edit(order.id, editedOrder)
  }

  const initOrderStates = () => {
    pedidos.forEach((order) => {
      changeState(order, stateList[0])
    })
  }

  const resetPedidos = () => setNuevosPedidos(0);


  useEffect(() => {
    const socket: Socket = io(import.meta.env.VITE_API_URL);
    const notification = new Audio("/audio/notification.mp3");

    socket.on("nuevo-pedido", (pedido: Pedido) => {
      console.log("📦 Nuevo pedido recibido:", pedido);
      notification.play();
      setNuevosPedidos((prev) => prev + 1);
      agregarPedido(pedido);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <PedidoContext.Provider
      value={{ pedidos, agregarPedido, eliminarPedido, nuevosPedidos, resetPedidos, changeState, initOrderStates }}
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
