import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import './App.css'
import Navbar  from './components/Navbar/Navbar'
import Footer  from './components/Footer/Footer'
import Cursor  from './components/Cursor/Cursor'
import Loader  from './components/Loader/Loader'
import { TransitionProvider } from './context/TransitionContext'

import Home      from './pages/Home/Home'
import Proyectos from './pages/Proyectos/Proyectos'
import ProjectDetail from './pages/DetallesProyectos/DetallesProyectos'
import Servicios from './pages/Servicios/Servicios'
import Nosotros  from './pages/Nosotros/Nosotros'
import Contacto  from './pages/Contacto/Contacto'
import WhatsAppButton from './components/WhatsAppButton/WhatsAppButton'


gsap.registerPlugin(ScrollTrigger)

function ScrollReset() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
    setTimeout(() => ScrollTrigger.refresh(), 150)
  }, [pathname])
  return null
}

export default function App() {
  return (

    <BrowserRouter>

      <TransitionProvider>
        <WhatsAppButton />

        <Loader />
        <Cursor />
        <Navbar />
        <ScrollReset />
        <Routes>
          <Route path="/"          element={<Home />} />
          <Route path="/proyectos" element={<Proyectos />} />
          <Route path="/proyectos/:slug" element={<ProjectDetail />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/nosotros"  element={<Nosotros />} />
          <Route path="/contacto"  element={<Contacto />} />
        </Routes>
        <Footer />
      </TransitionProvider>
    </BrowserRouter>
  )
}