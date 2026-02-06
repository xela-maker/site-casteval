import { useRef, useEffect } from 'react';

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

interface SwipeState {
  startX: number;
  startY: number;
  startTime: number;
}

export function useSwipeGesture(handlers: SwipeHandlers) {
  const elementRef = useRef<HTMLDivElement>(null);
  const swipeState = useRef<SwipeState | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      swipeState.current = {
        startX: touch.clientX,
        startY: touch.clientY,
        startTime: Date.now(),
      };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!swipeState.current) return;

      const touch = e.touches[0];
      const deltaX = touch.clientX - swipeState.current.startX;
      const deltaY = touch.clientY - swipeState.current.startY;

      // Se o swipe é mais horizontal que vertical, previne scroll
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        e.preventDefault();
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!swipeState.current) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - swipeState.current.startX;
      const deltaY = touch.clientY - swipeState.current.startY;
      const deltaTime = Date.now() - swipeState.current.startTime;

      // Distância mínima para ser considerado um swipe (50px)
      const minDistance = 50;
      
      // Velocidade mínima (px/ms) - quanto mais rápido, menos distância precisa
      const velocity = Math.abs(deltaX) / deltaTime;
      const minVelocity = 0.3;

      // Swipe deve ser mais horizontal que vertical
      const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);

      if (isHorizontalSwipe && (Math.abs(deltaX) > minDistance || velocity > minVelocity)) {
        if (deltaX < 0 && handlers.onSwipeLeft) {
          // Swipe para esquerda - próxima imagem
          handlers.onSwipeLeft();
        } else if (deltaX > 0 && handlers.onSwipeRight) {
          // Swipe para direita - imagem anterior
          handlers.onSwipeRight();
        }
      }

      swipeState.current = null;
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handlers]);

  return elementRef;
}
