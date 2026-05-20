import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { LOGO } from '../../config/media'

export default function Loader() {
  const loaderRef  = useRef(null)
  const counterRef = useRef(null)
  const barRef     = useRef(null)
  const nameRef    = useRef(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const obj = { val: 0 }

    const tl = gsap.timeline({
      delay: 0.1,
      onComplete: () => {
        gsap.to(loaderRef.current, {
          clipPath: 'inset(100% 0% 0% 0%)',
          duration: 0.9,
          ease: 'power4.inOut',
          onComplete: () => {
            if (loaderRef.current) loaderRef.current.style.display = 'none'
            document.body.style.overflow = ''
          }
        })
      }
    })

    tl.to(counterRef.current, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, 0)
    tl.to(nameRef.current,    { opacity: 1,       duration: 0.4, ease: 'power2.out' }, 0.3)
    tl.to(obj, {
      val: 100,
      duration: 2.0,
      ease: 'power1.inOut',
      snap: { val: 1 },
      onUpdate() {
        const v = Math.round(obj.val)
        if (counterRef.current) counterRef.current.textContent = v
        if (barRef.current)     barRef.current.style.transform = `scaleX(${v / 100})`
      }
    }, 0.2)
  }, [])

  return (
    <div
      className="page-loader"
      ref={loaderRef}
      style={{ clipPath: 'inset(0% 0% 0% 0%)' }}
    >
      <span className="page-loader__counter" ref={counterRef}>0</span>
      <div className="page-loader__row">
        <img
          src={LOGO}
          alt="Estudio Levinton Napoleone"
          className="page-loader__logo"
          ref={nameRef}
        />
        <div className="page-loader__bar-wrap">
          <div className="page-loader__bar" ref={barRef} />
        </div>
      </div>
    </div>
  )
}