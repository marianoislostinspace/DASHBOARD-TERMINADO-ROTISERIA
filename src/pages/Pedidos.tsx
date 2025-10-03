// Librerías
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
// Contextos
import { usePedidos } from '../contexts/PedidoContext';
// Assets
import '../assets/styles/orderPage.css'
import type { Pedido } from '../assets/types/types';
import { OrderCard } from '../components/OrderCard';
import Swal from 'sweetalert2';
import { swalThemeConfig } from '../assets/ThemeData';
import { stateList } from '../hooks/useStateManager';


export const Pedidos = () => {
  const API_URL = import.meta.env.VITE_API_URL;

  const [pedidosHistorial, setPedidosHistorial] = useState<Pedido[]>([]);
  const [estadosPedidos, setEstadosPedidos] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState(""); 

  const { pedidos, agregarPedido, eliminarPedido, initOrderStates } = usePedidos();

  // Conexión a WebSocket
  useEffect(() => {
    const socket = io(API_URL);

    socket.on('nuevo-pedido', (data: Pedido) => {
      setPedidosHistorial(prev => {
        const yaExiste = prev.some(p => p.id === data.id);
        if (!yaExiste) {
          Swal.fire({
            ...swalThemeConfig,
            title: '📦 Nuevo pedido recibido',
            text: `Cliente: ${data.cliente.nombre}`,
            icon: 'info',
            timer: 3000,
            showConfirmButton: false
          });
          return [data, ...prev];
        }
        return prev;
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [API_URL]);


  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No hay token en localStorage");
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
          setPedidosHistorial(data);
          (data as Pedido[]).forEach((order) => {
            if (!order.state) {
              order.state = stateList[0]
            }
            agregarPedido(order)
          })
        } else {
          console.warn("La API devolvió un objeto en vez de un array:", data);
          setPedidosHistorial([]);
        }

        console.log("📦 Pedidos cargados:", data);
        
      } catch (err: any) {
        setError(err.message);
      }
    };

    const estadosGuardados = localStorage.getItem("estadosPedidos");
    if (estadosGuardados) {
      setEstadosPedidos(JSON.parse(estadosGuardados));
    }

    fetchPedidos();
  }, [API_URL]);

  //  Cambiar estado del pedido
  const cambiarEstado = (id: string, nuevoEstado: string) => {
    const nuevosEstados = {
      ...estadosPedidos,
      [id]: nuevoEstado,
    };

    setEstadosPedidos(nuevosEstados);
    localStorage.setItem("estadosPedidos", JSON.stringify(nuevosEstados));
  };

  return (
    <div className='containerPadre'>
      {error && <p className="text-red-500">{error}</p>}

      <div className='pedidosWrapper'>
        {pedidos.length > 0 ? (
          pedidos.map((pedido) => (
            <OrderCard order={pedido} key={pedido.id} />
          ))
        ) : (
          <p>No hay pedidos cargados</p>
        )}
      </div>
    </div>
  );
};
