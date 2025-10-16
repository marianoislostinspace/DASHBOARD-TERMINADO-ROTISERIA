import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App.tsx'

// Contextos
import { BackendDataProvider } from './contexts/BackendDataProvider.tsx';
import { PopUpProvider } from './contexts/PopUpContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BackendDataProvider>
      <PopUpProvider>
        <App />
      </PopUpProvider>
    </BackendDataProvider>
  </StrictMode>
)
