import React, { useEffect, useState } from 'react'
import '../assets/styles/historial.css'
import { fetchApi } from '../utils/api';
import Swal from 'sweetalert2'
import type { Pedido } from '../assets/types/types';


export const HistorialPedidos = () => {

  const [pedidosHistorial, setpedidosHistorial] = useState<Pedido[]>([])
  const [pedSum, setpedSum] = useState<Pedido[]>([])
  const [total, settotal] = useState<number>(0)
  const [estadosPedidos, setEstadosPedidos] = useState<{ [key: string]: string }>({})


  const API_URL = import.meta.env.VITE_API_URL;


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


  const eliminarPedido = async (pedidoId: string) => {
    const result = await Swal.fire({
      title: "¿Estás seguro que quieres eliminar este pedido?",
      text: "¡No hay vuelta atrás!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar"
    });

    if (result.isConfirmed) {
      try {
        await fetchApi(`pedidos/${pedidoId}`, "DELETE")
        setpedidosHistorial(pedidosHistorial.filter((pedido) =>
          pedido.id !== pedidoId))
        Swal.fire({
          title: "Completado!",
          icon: "success",
          text: "pedido eliminado con exito",
          draggable: true
        });
      } catch (error) {
        console.log("Error al eliminar el pedido", error)
      }
    }
  }

  const suma = (pedido: Pedido) => {
    setpedSum((prev) => {
      const nuevoArray = [...prev, pedido]
      const totalRecaudado = nuevoArray.reduce((acc, p) => acc + p.total, 0)
      settotal(totalRecaudado)
      return nuevoArray
    })
  }

  const reiniciar = () => {
    setpedSum([])
    settotal(0)
  }



  const cambiarEstado = (id: string, nuevoEstado: string) => {
    const nuevosEstados = {
      ...estadosPedidos,
      [id]: nuevoEstado
    };

    setEstadosPedidos(nuevosEstados);
    localStorage.setItem("estadosPedidos", JSON.stringify(nuevosEstados));
  };




  return (
    <>
      <div className="Total">
        <h1>Total Recaudado: ${total}</h1>
      </div>
      <button className='resetButton' onClick={reiniciar}>Reiniciar contador</button>


      <div className='pedidosWrapper'>
        {pedidosHistorial && pedidosHistorial.map((pedido) => (
          <div className='container' key={pedido.id}
            style={{
              backgroundColor:
                estadosPedidos[pedido.id] === 'listo' ? '#7bff00' :
                  estadosPedidos[pedido.id] === 'preparacion' ? '#ff9900' :
                    estadosPedidos[pedido.id] === 'cancelado' ? '#ff0000' :
                      'transparent'
            }}
          >
            Pedido recibido: {new Date(pedido.fecha).toLocaleString()}
            <br />
            Cliente: {pedido.cliente.nombre}, Telefono: 📞  {pedido.cliente.telefono}
            <br />
            <div className='pedidoSubContainer'>
              Pedido: {pedido?.items?.map((item) => (
                <div>
                  <h1>{item.nombre}</h1>
                  <h1>${item.precio}</h1>
                  <h1>Cantidad: x{item.cantidad}</h1>
                  Opciones: {item?.opcionesSeleccionadas?.map((opc) => (
                    <ul key={opc.id} className='opciones'>
                      <li>{opc.nombre} : {opc.precioExtra}</li>
                    </ul>
                  ))}
                </div>
              ))}
              <h1>TOTAL: 🧾 ${pedido.total}</h1>
            </div>
            <button className='sumarButton' onClick={() => suma(pedido)}>Sumar al Total</button>
            <button className='ElininarButton' onClick={() => eliminarPedido(pedido.id)}>Eliminar pedido</button>

            <div className='estadoButtondiv'>
              <button className='estadoButton' onClick={() => cambiarEstado(pedido.id, 'preparacion')}>En preparación</button>
              <button className='estadoButton' onClick={() => cambiarEstado(pedido.id, 'listo')}>Listo</button>
              <button className='estadoButton' onClick={() => cambiarEstado(pedido.id, 'cancelado')}>Cancelado</button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
