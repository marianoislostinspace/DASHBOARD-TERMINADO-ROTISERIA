import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { usePedidos } from '../contexts/PedidoContext'; // o el path donde tengas tu context
import '../assets/styles/pedidosEntrantes.css'
import Swal from 'sweetalert2'



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


export const Pedidos = () => {
  const API_URL = import.meta.env.VITE_API_URL;


  const { pedidos, agregarPedido, eliminarPedido } = usePedidos()

  useEffect(() => {
    const socket = io(API_URL);

    socket.on('nuevo-pedido', (data: Pedido) => {
      console.log('Pedido recibido por socket:', data);
      agregarPedido(data); // usar la función del context
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className='containerPadre'>
      <h1>Pedidos en tiempo real</h1>
      {pedidos.map((pedido) => (
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
      ))}
    </div>
  );
};
