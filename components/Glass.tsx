
import React, { ReactNode } from 'react'


export default function Glass() {
  return (
    <>
      <div className="liquid-glass">
  <div className="glass-text">Liquid Glass</div>
</div>

<svg xmlns="http://www.w3.org/2000/svg" style={{ display: 'none' }}>
  <defs>
    <filter id="glass-distortion" x="0%" y="0%" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.013 0.013" numOctaves="2" seed="92" result="noise" />
      <feGaussianBlur in="noise" stdDeviation="2" result="blurred" />
      <feDisplacementMap in="SourceGraphic" in2="blurred" scale="38" xChannelSelector="R" yChannelSelector="G" />
    </filter>
  </defs>
</svg>
    </>
  )
}

