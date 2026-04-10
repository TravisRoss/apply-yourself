import { useRef } from "react"

const SCROLL_THRESHOLD = 10

export function useScrollGuard(onTap: () => void) {
  const startY = useRef<number | null>(null)

  function onPointerDown(event: React.PointerEvent) {
    event.preventDefault()
    startY.current = event.clientY
  }

  function onPointerUp(event: React.PointerEvent) {
    if (startY.current === null) return
    const didScroll = Math.abs(event.clientY - startY.current) > SCROLL_THRESHOLD
    if (!didScroll) onTap()
    startY.current = null
  }

  return { onPointerDown, onPointerUp }
}
