// components/NeonBackground.tsx
'use client'

import { useEffect, useRef } from 'react'

export default function NeonBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Simple wave drawing function
    const drawWaves = () => {
      if (!ctx) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Draw electric waves
      const time = Date.now() * 0.001
      
      for (let i = 0; i < 3; i++) {
        ctx.beginPath()
        ctx.moveTo(0, canvas.height * 0.7)
        
        for (let x = 0; x < canvas.width; x += 10) {
          const y = canvas.height * 0.7 + 
                   Math.sin(x * 0.01 + time + i * 2) * 20 +
                   Math.cos(x * 0.005 + time) * 10
          
          ctx.lineTo(x, y)
        }
        
        ctx.strokeStyle = i === 0 ? 'rgba(0, 243, 255, 0.1)' :
                         i === 1 ? 'rgba(255, 0, 255, 0.08)' :
                         'rgba(0, 255, 135, 0.06)'
        ctx.lineWidth = 2
        ctx.stroke()
      }
    }

    const animate = () => {
      drawWaves()
      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 opacity-50"
    />
  )
}