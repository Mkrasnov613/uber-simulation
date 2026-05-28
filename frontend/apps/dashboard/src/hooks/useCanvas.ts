import { useEffect, useRef } from 'react'
import { Renderer } from '../canvas/Renderer'

export const useCanvas = () => {
  const canvasRef   = useRef<HTMLCanvasElement>(null)
  const rendererRef = useRef<Renderer | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width  = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const renderer = new Renderer(canvas)
    rendererRef.current = renderer
    renderer.start()

    const onResize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      renderer.resize(canvas.width, canvas.height)
    }
    window.addEventListener('resize', onResize)

    return () => {
      renderer.stop()
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return { canvasRef, rendererRef }
}