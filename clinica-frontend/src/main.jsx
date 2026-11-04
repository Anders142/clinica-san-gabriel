import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ClinicaProvider } from './context/ClinicaContext.jsx'

// createRoot() crea la raíz de React sobre <div id="root"> y render() monta
// el árbol de componentes; a partir de ahí React compara el DOM virtual con
// el DOM real y actualiza solo lo que cambió.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClinicaProvider>
      <App />
    </ClinicaProvider>
  </StrictMode>,
)
