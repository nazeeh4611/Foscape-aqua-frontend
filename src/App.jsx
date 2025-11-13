import React from 'react'
import AppRoute from './Routes/AppRoute'
import { AuthProvider } from './Context.js/Auth'
function App() {
  return (
    <>
    <AuthProvider>
    <AppRoute/>
    </AuthProvider>
    </>
  )
}

export default App