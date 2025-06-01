import { useState, useCallback, useRef, useEffect } from 'react';

interface Position {
  x: number;
  y: number;
}

interface Size {
  width: number;
  height: number;
}

interface WindowState {
  position: Position;
  size: Size;
  isDragging: boolean;
  isResizing: boolean;
  isMaximized: boolean;
}

interface UseWindowOptions {
  initialPosition?: Position;
  initialSize?: Size;
  minSize?: Size;
  maxSize?: Size;
  bounds?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

export const useWindow = (options: UseWindowOptions = {}) => {
  const {
    initialPosition = { x: 0, y: 0 },
    initialSize = { width: 400, height: 300 },
    minSize = { width: 200, height: 150 },
    maxSize = { width: window.innerWidth, height: window.innerHeight },
    bounds
  } = options;

  const [state, setState] = useState<WindowState>({
    position: initialPosition,
    size: initialSize,
    isDragging: false,
    isResizing: false,
    isMaximized: false
  });

  const dragStartPos = useRef<Position>({ x: 0, y: 0 });
  const resizeStartPos = useRef<Position>({ x: 0, y: 0 });
  const resizeStartSize = useRef<Size>({ width: 0, height: 0 });

  const constrainPosition = useCallback((pos: Position): Position => {
    if (!bounds) return pos;

    return {
      x: Math.max(bounds.left, Math.min(bounds.right - state.size.width, pos.x)),
      y: Math.max(bounds.top, Math.min(bounds.bottom - state.size.height, pos.y))
    };
  }, [bounds, state.size]);

  const constrainSize = useCallback((size: Size): Size => {
    return {
      width: Math.max(minSize.width, Math.min(maxSize.width, size.width)),
      height: Math.max(minSize.height, Math.min(maxSize.height, size.height))
    };
  }, [minSize, maxSize]);

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    dragStartPos.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    setState(prev => ({ ...prev, isDragging: true }));
  }, []);

  const handleDrag = useCallback((e: MouseEvent) => {
    if (!state.isDragging) return;

    const newPosition = constrainPosition({
      x: e.clientX - dragStartPos.current.x,
      y: e.clientY - dragStartPos.current.y
    });

    setState(prev => ({
      ...prev,
      position: newPosition
    }));
  }, [state.isDragging, constrainPosition]);

  const handleDragEnd = useCallback(() => {
    setState(prev => ({ ...prev, isDragging: false }));
  }, []);

  const handleResizeStart = useCallback((e: React.MouseEvent, direction: 'n' | 'e' | 's' | 'w' | 'ne' | 'nw' | 'se' | 'sw') => {
    e.preventDefault();
    resizeStartPos.current = { x: e.clientX, y: e.clientY };
    resizeStartSize.current = { ...state.size };
    setState(prev => ({ ...prev, isResizing: true }));
  }, [state.size]);

  const handleResize = useCallback((e: MouseEvent, direction: 'n' | 'e' | 's' | 'w' | 'ne' | 'nw' | 'se' | 'sw') => {
    if (!state.isResizing) return;

    const deltaX = e.clientX - resizeStartPos.current.x;
    const deltaY = e.clientY - resizeStartPos.current.y;
    let newSize = { ...resizeStartSize.current };
    let newPosition = { ...state.position };

    // Handle horizontal resizing
    if (direction.includes('e')) {
      newSize.width = resizeStartSize.current.width + deltaX;
    } else if (direction.includes('w')) {
      newSize.width = resizeStartSize.current.width - deltaX;
      newPosition.x = state.position.x + deltaX;
    }

    // Handle vertical resizing
    if (direction.includes('s')) {
      newSize.height = resizeStartSize.current.height + deltaY;
    } else if (direction.includes('n')) {
      newSize.height = resizeStartSize.current.height - deltaY;
      newPosition.y = state.position.y + deltaY;
    }

    newSize = constrainSize(newSize);
    newPosition = constrainPosition(newPosition);

    setState(prev => ({
      ...prev,
      size: newSize,
      position: newPosition
    }));
  }, [state.isResizing, state.position, constrainSize, constrainPosition]);

  const handleResizeEnd = useCallback(() => {
    setState(prev => ({ ...prev, isResizing: false }));
  }, []);

  const toggleMaximize = useCallback(() => {
    setState(prev => {
      if (prev.isMaximized) {
        return {
          ...prev,
          isMaximized: false,
          position: initialPosition,
          size: initialSize
        };
      } else {
        return {
          ...prev,
          isMaximized: true,
          position: { x: 0, y: 0 },
          size: { width: window.innerWidth, height: window.innerHeight }
        };
      }
    });
  }, [initialPosition, initialSize]);

  useEffect(() => {
    if (state.isDragging) {
      window.addEventListener('mousemove', handleDrag);
      window.addEventListener('mouseup', handleDragEnd);
    }
    if (state.isResizing) {
      const handleResizeMove = (e: MouseEvent) => handleResize(e, 'se');
      window.addEventListener('mousemove', handleResizeMove);
      window.addEventListener('mouseup', handleResizeEnd);
      return () => {
        window.removeEventListener('mousemove', handleResizeMove);
        window.removeEventListener('mouseup', handleResizeEnd);
      };
    }
    return () => {
      window.removeEventListener('mousemove', handleDrag);
      window.removeEventListener('mouseup', handleDragEnd);
    };
  }, [state.isDragging, state.isResizing, handleDrag, handleDragEnd, handleResize, handleResizeEnd]);

  return {
    state,
    handleDragStart,
    handleResizeStart,
    toggleMaximize,
    style: {
      position: 'fixed' as const,
      left: state.position.x,
      top: state.position.y,
      width: state.size.width,
      height: state.size.height,
      cursor: state.isDragging ? 'grabbing' : 'grab',
      userSelect: 'none' as const,
      zIndex: 1000
    }
  };
}; 