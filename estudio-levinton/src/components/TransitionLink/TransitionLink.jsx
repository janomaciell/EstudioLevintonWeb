import { useNavigate } from 'react-router-dom'
import { useTransition } from '../context/TransitionContext'

/**
 * Drop-in replacement for <Link> with curtain wipe transition.
 * Props: to, children, className, style, ...rest
 */
export default function TransitionLink({ to, children, className, style, ...rest }) {
  const navigate   = useNavigate()
  const { transition } = useTransition()

  const handleClick = (e) => {
    e.preventDefault()
    transition(() => navigate(to))
  }

  return (
    <a href={to} onClick={handleClick} className={className} style={style} {...rest}>
      {children}
    </a>
  )
}