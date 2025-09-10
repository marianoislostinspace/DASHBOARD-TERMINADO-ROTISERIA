import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App.tsx'

// Contextos
import { PedidoProvider } from './contexts/PedidoContext.tsx';
import { SocketProvider } from './contexts/socketProvider.tsx';
import { ProductsDataProvider } from './contexts/ProductsDataContext.tsx';
import { PopUpProvider } from './contexts/PopUpContext.tsx';

createRoot(document.getElementById('root')!).render(
  <PedidoProvider>
    <StrictMode>
      <SocketProvider>
        <ProductsDataProvider>
          <PopUpProvider>
            <App />
          </PopUpProvider>
        </ProductsDataProvider>
      </SocketProvider>
    </StrictMode>
  </PedidoProvider>

)
