// Librerías
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
// Contextos
import { usePedidos } from '../contexts/PedidoContext';
// Assets
import '../assets/styles/orderPage.css'
import type { Pedido } from '../assets/types/types';
import { OrderCard } from '../components/OrderCard';


export const Pedidos = () => {
  const API_URL = import.meta.env.VITE_API_URL;

  const [pedidosHistorial, setpedidosHistorial] = useState<Pedido[]>([])
  const { pedidos, agregarPedido, eliminarPedido } = usePedidos()
  const [estadosPedidos, setEstadosPedidos] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    const socket = io(API_URL);

    socket.on('nuevo-pedido', (data: Pedido) => {
      agregarPedido(data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchPedidos = async () => {
      const response = await fetch(`${API_URL}/pedidos`)
      const data = await response.json()

      setpedidosHistorial(data)
      console.log(data)
    }

    const estadosGuardados = localStorage.getItem("estadosPedidos");
    if (estadosGuardados) {
      setEstadosPedidos(JSON.parse(estadosGuardados));
    }

    fetchPedidos()
  }, [])

  const cambiarEstado = (id: string, nuevoEstado: string) => {
    const nuevosEstados = {
      ...estadosPedidos,
      [id]: nuevoEstado
    };

    setEstadosPedidos(nuevosEstados);
    localStorage.setItem("estadosPedidos", JSON.stringify(nuevosEstados));
  };



  return (
    <div className='containerPadre'>
      <div className='pedidosWrapper'>
        {pedidosHistorial && pedidosHistorial.map((pedido) => (
          <OrderCard order={pedido} key={pedido.id}>

          </OrderCard>
        ))}
      </div>



      {/* --- Antiguo diseño de pedido --- */}
      {/*pedidos.map((pedido) => (
        <div key={pedido.id} className='pedido'>
          <h2>Cliente: {pedido.cliente.nombre}</h2>
          <p>Teléfono: {pedido.cliente.telefono}</p>
          <p>Total: ${pedido.total}</p>
          <p>Fecha: {new Date(pedido.fecha).toLocaleString()}</p>

          <h3>Pedido:</h3>
          <ul>
            {pedido.items.map((item, index) => (
              <li key={index}>
                <strong>{item.nombre}</strong> - ${item.precio}
                <br />
                <strong>Cantidad: x{item.cantidad}</strong>
                <br />
                Nota: {item.nota}
                <br />
                Opciones:
                <ul>
                  {item.opcionesSeleccionadas.map((opcion) => (
                    <li key={opcion.id} className='opcion'>
                      Nombre: {opcion.nombre}
                      <br />
                      <br />
                      Precio Extra: ${opcion.precioExtra}
                    </li>
                  ))}
                </ul>
                <br />
                <br />
              </li>
            ))}
            <br />
          </ul>
          <button onClick={() => eliminarPedido(pedido.id)}>Eliminar Pedido</button>
        </div>
      ))*/}
    </div>
  );
};
