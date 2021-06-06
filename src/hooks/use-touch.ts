import { useState } from 'react';

type TDirection = 'left' | 'right' | 'up' | 'down' | '';

function useTouch() {
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [endX, setEndX] = useState(0);
  const [endY, setEndY] = useState(0);
  const [direction, setDirection] = useState<TDirection>('');

  function touchStart(e: any) {
    setStartX(e.changedTouches[0].pageX);
    setStartY(e.changedTouches[0].pageY);
    setEndX(e.changedTouches[0].pageX);
    setEndY(e.changedTouches[0].pageY);
  }

  function touchEnd(e: any) {
    const endX = e.changedTouches[0].pageX;
    const endY = e.changedTouches[0].pageY;
    setEndX(endX);
    setEndY(endY);
    const sX = endX - startX;
    const sY = endY - startY;
    setDirection('');
    // left or right
    if (Math.abs(sX) > Math.abs(sY)) {
      if (sX >= 0) {
        setDirection('right');
        return;
      }
      setDirection('left');
      return;
    }
    // up or down
    if (Math.abs(sX) < Math.abs(sY)) {
      if (sY >= 0) {
        setDirection('up');
        return;
      }
      setDirection('down');
      return;
    }
  }

  return {
    touchStart,
    touchEnd,
    direction,
    x: Math.abs(startX - endX),
    y: Math.abs(startY - endY),
  };
}

export default useTouch;
