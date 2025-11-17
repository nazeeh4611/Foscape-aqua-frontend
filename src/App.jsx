import React from 'react'
import AppRoute from './Routes/AppRoute'
import { AuthProvider } from './Context.js/Auth'
import { CartWishlistProvider } from './Context.js/Cartwishlist'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ClientId } from './Base/Base';

function App() {
  return (
    <GoogleOAuthProvider clientId={ClientId}>
      <AuthProvider>
        <CartWishlistProvider>  
          <AppRoute/>
        </CartWishlistProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  )
}

export default App
