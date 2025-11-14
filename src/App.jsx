import React from 'react'
import AppRoute from './Routes/AppRoute'
import { AuthProvider } from './Context.js/Auth'
import { CartWishlistProvider } from './Context.js/Cartwishlist'

function App() {
  return (
    <>
      <AuthProvider>
        <CartWishlistProvider>  
          <AppRoute/>
        </CartWishlistProvider>
      </AuthProvider>
    </>
  )
}

export default App
