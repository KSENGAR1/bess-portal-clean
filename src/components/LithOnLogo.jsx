import { useState } from 'react'

export default function LithOnLogo({ size = 40, className = '', style = {} }) {
  const [imgFailed, setImgFailed] = useState(false)

  if (!imgFailed) {
    return (
      <img
        src="/lith-on-logo.png"
        alt="Lith-On"
        width={size}
        height={size}
        className={className}
        style={{ objectFit: 'contain', ...style }}
        onError={() => setImgFailed(true)}
      />
    )
  }

  /* SVG fallback */
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-label="Lith-On"
    >
      <rect x="10" y="14" width="40" height="28" rx="4" stroke="#1E40AF" strokeWidth="3" fill="none"/>
      <rect x="50" y="22" width="5" height="12" rx="2" fill="#1E40AF"/>
      <path d="M36 16 L26 34 H34 L28 50 L44 28 H36 L42 16 Z" fill="#E84B2A" opacity="0.9"/>
    </svg>
  )
}
