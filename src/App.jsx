import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './Page/Auth/Login'
import RegistrarUsuario from './Page/Auth/RegistrarUsuario'
import Home from './Page/Home/Home'

function App() {
  

  return (
    <>
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/registro" element={<RegistrarUsuario />} />
            <Route path="/home" element={<Home />} />
          </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
