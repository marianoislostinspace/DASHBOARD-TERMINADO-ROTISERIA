import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App.tsx'

// Contextos
import { BackendDataProvider } from './contexts/BackendDataProvider.tsx';
import { PopUpProvider } from './contexts/PopUpContext.tsx';
import { NavbarProvider } from './contexts/NavbarContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BackendDataProvider>
      <NavbarProvider>
        <PopUpProvider>
          <App />
        </PopUpProvider>
      </NavbarProvider>
    </BackendDataProvider>
  </StrictMode>
)
