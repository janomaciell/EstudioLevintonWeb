import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function Cursor() {
  const dotRef  = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    const dot  = dotRef.current
    const ring = ringRef.current

    const dotX  = gsap.quickTo(dot,  'x', { duration: 0.1,  ease: 'power3.out' })
    const dotY  = gsap.quickTo(dot,  'y', { duration: 0.1,  ease: 'power3.out' })
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3.out' })
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3.out' })

    const onMove = (e) => { dotX(e.clientX); dotY(e.clientY); ringX(e.clientX); ringY(e.clientY) }

    const onEnter = () => {
      gsap.to(ring, { scale: 2.5, duration: 0.35, ease: 'power2.out' })
      gsap.to(dot,  { scale: 0,   duration: 0.2 })
    }
    const onLeave = () => {
      gsap.to(ring, { scale: 1, duration: 0.5, ease: 'elastic.out(1,0.5)' })
      gsap.to(dot,  { scale: 1, duration: 0.3 })
    }

    window.addEventListener('mousemove', onMove)
    document.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <>
      <div className="cursor-dot"  ref={dotRef}  />
      <div className="cursor-ring" ref={ringRef} />
    </>
  )
}