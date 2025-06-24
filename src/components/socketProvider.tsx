// src/providers/SocketProvider.tsx
import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { usePedidos } from '../components/PedidoContext'; // ajustá el path si hace falta

const socket = io(import.meta.env.VITE_API_URL);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { agregarPedido } = usePedidos();

  useEffect(() => {
    socket.on('nuevo-pedido', (pedido) => {
      console.log("📦 Nuevo pedido recibido:", pedido);
      agregarPedido(pedido); // actualiza el estado global
    });

    return () => {
      socket.off('nuevo-pedido');
    };
  }, []);

  return <>{children}</>;
};
