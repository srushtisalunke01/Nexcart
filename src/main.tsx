import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { ThemeProvider } from './context/ThemeContext'
import { CartProvider } from './context/CartContext'
import { MarketplaceProvider } from './context/MarketplaceContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <CartProvider>
        <MarketplaceProvider>
          <App />
        </MarketplaceProvider>
      </CartProvider>
    </ThemeProvider>
  </React.StrictMode>,
)

