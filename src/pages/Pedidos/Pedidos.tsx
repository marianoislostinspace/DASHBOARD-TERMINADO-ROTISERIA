// Contextos
import { usePedidos } from '../../contexts/PedidoContext';
import { useNavBar } from '../../contexts/NavbarContext';
// Componentes
import { OrderPageButtons } from './OrderPageButtons';
// Assets
import '../../assets/styles/orderPage.css'
import { OrderCard } from '../../components/OrderCard';
import { useEffect } from 'react';


export const Pedidos = () => {
  const { pedidos } = usePedidos();
  const {setButtons} = useNavBar()

  useEffect(() => {
    setButtons(OrderPageButtons())

    return () => {
      setButtons(<></>)
    }
  },[])

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


