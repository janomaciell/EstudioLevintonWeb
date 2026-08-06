import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import './App.css'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import Cursor from './components/Cursor/Cursor'
import Loader from './components/Loader/Loader'
import { TransitionProvider } from './context/TransitionContext'
import WhatsAppButton from './components/WhatsAppButton/WhatsAppButton'

import Home from './pages/Home/Home'
import Proyectos from './pages/Proyectos/Proyectos'
import ProjectDetail from './pages/DetallesProyectos/DetallesProyectos'
import Servicios from './pages/Servicios/Servicios'
import Nosotros from './pages/Nosotros/Nosotros'
import Contacto from './pages/Contacto/Contacto'
import NotFound from './pages/NotFound/NotFound'

gsap.registerPlugin(ScrollTrigger)

function ScrollReset() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
    setTimeout(() => ScrollTrigger.refresh(), 150)
  }, [pathname])
  return null
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/proyectos" element={<Proyectos />} />
      <Route path="/proyectos/:slug" element={<ProjectDetail />} />
      <Route path="/servicios" element={<Servicios />} />
      <Route path="/nosotros" element={<Nosotros />} />
      <Route path="/contacto" element={<Contacto />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <TransitionProvider>
        {/* Skip to content for accessibility WCAG AA */}
        <a href="#main-content" className="skip-link">Saltar al contenido principal</a>

        <WhatsAppButton />
        <Loader />
        <Cursor />
        <Navbar />
        <ScrollReset />

        <div id="main-content">
          <AppRoutes />
        </div>

        <Footer />
      </TransitionProvider>
    </BrowserRouter>
  )
}