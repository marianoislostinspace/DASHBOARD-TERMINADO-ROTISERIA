import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App.tsx'

// Contextos
import { PedidoProvider } from './contexts/PedidoContext.tsx';
import { ProductsDataProvider } from './contexts/ProductsDataContext.tsx';
import { PopUpProvider } from './contexts/PopUpContext.tsx';

createRoot(document.getElementById('root')!).render(
  <PedidoProvider>
    <StrictMode>
        <ProductsDataProvider>
          <PopUpProvider>
            <App />
          </PopUpProvider>
        </ProductsDataProvider>
    </StrictMode>
  </PedidoProvider>

)
