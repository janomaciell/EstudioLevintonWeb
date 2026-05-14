import { createContext, useContext, useRef, useCallback } from 'react'
import { gsap } from 'gsap'

const TransitionContext = createContext(null)

export function TransitionProvider({ children }) {
  const curtainRef = useRef(null)

  const transition = useCallback(
    (onMidpoint) =>
      new Promise((resolve) => {
        const curtain = curtainRef.current
        if (!curtain) { onMidpoint(); resolve(); return }

        const tl = gsap.timeline({ onComplete: resolve })

        tl.set(curtain, { autoAlpha: 1, yPercent: 100 })
          .to(curtain, {
            yPercent: 0,
            duration: 0.7,
            ease: 'power4.inOut',
            onComplete: onMidpoint,
          })
          .to({}, { duration: 0.1 })
          .to(curtain, {
            yPercent: -100,
            duration: 0.7,
            ease: 'power4.inOut',
          })
          .set(curtain, { autoAlpha: 0 })
      }),
    []
  )

  return (
    <TransitionContext.Provider value={{ transition, curtainRef }}>
      {children}
      <div ref={curtainRef} className="transition-curtain" />
    </TransitionContext.Provider>
  )
}

export function useTransition() {
  return useContext(TransitionContext)
}