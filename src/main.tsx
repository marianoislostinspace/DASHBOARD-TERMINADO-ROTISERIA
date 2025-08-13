import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App.tsx'

// Contextos
import { PedidoProvider } from './components/contexts/PedidoContext.tsx';
import { SocketProvider } from './components/socketProvider.tsx';
import { ProductsDataProvider } from './components/contexts/ProductsDataContext.tsx';
import { PopUpProvider } from './components/contexts/PopUpContext.tsx';

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
