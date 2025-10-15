// Contextos
import { usePedidos } from '../contexts/PedidoContext';
// Assets
import '../assets/styles/orderPage.css'
import { OrderCard } from '../components/OrderCard';


export const Pedidos = () => {
  const { pedidos } = usePedidos();

  return (
    <div className='containerPadre'>
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
