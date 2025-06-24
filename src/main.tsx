import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App.tsx'
import { PedidoProvider } from './components/PedidoContext.tsx';
import { SocketProvider } from './components/socketProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <PedidoProvider>
    <StrictMode>
      <SocketProvider>
        <App />
      </SocketProvider>
    </StrictMode>,
  </PedidoProvider>
)
