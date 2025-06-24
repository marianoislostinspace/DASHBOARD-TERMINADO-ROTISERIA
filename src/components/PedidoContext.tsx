import { createContext, useState, useContext } from 'react';

type Pedido = {
  id: string;
  cliente: {
    nombre: string;
    telefono: number;
  };
  total: number;
  items: {
    idPlato: string;
    nombre: string;
    precio: number;
    cantidad: number
    opcionesSeleccionadas: {
      id: string,
      nombre: string,
      precioExtra: number
    }[];
    nota: string;
  }[];
  fecha: number;
  pedidoId: string;
};



type PedidoContextType = {
  pedidos: Pedido[];
  agregarPedido: (pedido: Pedido) => void;
  eliminarPedido: (id: string) => void;
};




const PedidoContext = createContext<PedidoContextType | undefined>(undefined);

export const PedidoProvider = ({ children }: { children: React.ReactNode }) => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  const agregarPedido = (pedido: Pedido) => {
      setPedidos((prev) => {
        if(prev.some((p) => p.id === pedido.id)){
          return prev;
        }
        return[...prev,pedido]
      });
  };

  const eliminarPedido = (id: string) => {
    setPedidos((prev) => prev.filter((p) => p.id !== id));
  };


  return (
    <PedidoContext.Provider value={{ pedidos, agregarPedido, eliminarPedido }}>
      {children}
    </PedidoContext.Provider>
  );
};

export const usePedidos = () => {
  const context = useContext(PedidoContext);
  if (!context) throw new Error('usePedidos debe usarse dentro de PedidoProvider');
  return context;
};