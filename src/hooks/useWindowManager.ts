import { useState, useCallback, useEffect } from 'react';

interface Position {
  x: number;
  y: number;
}

interface Size {
  width: number;
  height: number;
}

interface WindowBounds {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

interface UseWindowManagerProps {
  initialPosition?: Position;
  initialSize?: Size;
  minSize?: Size;
  maxSize?: Size;
  bounds?: WindowBounds;
  onPositionChange?: (position: Position) => void;
  onSizeChange?: (size: Size) => void;
}

interface WindowState {
  position: Position;
  size: Size;
  isDragging: boolean;
  isResizing: boolean;
  isMaximized: boolean;
  dragStart: Position;
  resizeStart: {
    position: Position;
    size: Size;
  };
}

export const useWindowManager = ({
  initialPosition = { x: 0, y: 0 },
  initialSize = { width: 400, height: 300 },
  minSize = { width: 300, height: 200 },
  maxSize = { width: window.innerWidth, height: window.innerHeight },
  bounds = {
    top: 0,
    right: window.innerWidth,
    bottom: window.innerHeight,
    left: 0
  },
  onPositionChange,
  onSizeChange
}: UseWindowManagerProps = {}) => {
  const [state, setState] = useState<WindowState>({
    position: initialPosition,
    size: initialSize,
    isDragging: false,
    isResizing: false,
    isMaximized: false,
    dragStart: { x: 0, y: 0 },
    resizeStart: {
      position: { x: 0, y: 0 },
      size: { width: 0, height: 0 }
    }
  });

  // Update bounds when window resizes
  useEffect(() => {
    const handleResize = () => {
      setState(prev => {
        if (prev.isMaximized) {
          return {
            ...prev,
            size: {
              width: window.innerWidth,
              height: window.innerHeight
            }
          };
        }
        return prev;
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDragStart = useCallback((e: React.MouseEvent | React.PointerEvent) => {
    if (state.isMaximized) return;
    
    const target = e.target as HTMLElement;
    // Don't initiate drag if clicking on interactive elements
    if (target.closest('button, a, input, select, textarea, [role="switch"], [data-no-drag]')) {
      return;
    }

    e.preventDefault();
    setState(prev => ({
      ...prev,
      isDragging: true,
      dragStart: {
        x: e.clientX - prev.position.x,
        y: e.clientY - prev.position.y
      }
    }));
  }, [state.isMaximized]);

  const handleResizeStart = useCallback((e: React.MouseEvent | React.PointerEvent, corner: 'se' | 'sw' | 'ne' | 'nw') => {
    if (state.isMaximized) return;
    
    e.preventDefault();
    setState(prev => ({
      ...prev,
      isResizing: true,
      resizeStart: {
        position: { ...prev.position },
        size: { ...prev.size }
      }
    }));
  }, [state.isMaximized]);

  const handleMove = useCallback((e: MouseEvent | PointerEvent) => {
    if (!state.isDragging) return;

    const newX = Math.min(Math.max(bounds.left, e.clientX - state.dragStart.x), bounds.right - state.size.width);
    const newY = Math.min(Math.max(bounds.top, e.clientY - state.dragStart.y), bounds.bottom - state.size.height);

    setState(prev => ({
      ...prev,
      position: { x: newX, y: newY }
    }));

    onPositionChange?.({ x: newX, y: newY });
  }, [state.isDragging, state.dragStart, state.size, bounds, onPositionChange]);

  const handleResize = useCallback((e: MouseEvent | PointerEvent) => {
    if (!state.isResizing) return;

    const dx = e.clientX - state.resizeStart.position.x;
    const dy = e.clientY - state.resizeStart.position.y;

    const newWidth = Math.min(Math.max(minSize.width, state.resizeStart.size.width + dx), maxSize.width);
    const newHeight = Math.min(Math.max(minSize.height, state.resizeStart.size.height + dy), maxSize.height);

    setState(prev => ({
      ...prev,
      size: { width: newWidth, height: newHeight }
    }));

    onSizeChange?.({ width: newWidth, height: newHeight });
  }, [state.isResizing, state.resizeStart, minSize, maxSize, onSizeChange]);

  const handleDragEnd = useCallback(() => {
    setState(prev => ({ ...prev, isDragging: false }));
  }, []);

  const handleResizeEnd = useCallback(() => {
    setState(prev => ({ ...prev, isResizing: false }));
  }, []);

  const toggleMaximize = useCallback(() => {
    setState(prev => {
      const newIsMaximized = !prev.isMaximized;
      return {
        ...prev,
        isMaximized: newIsMaximized,
        position: newIsMaximized ? { x: 0, y: 0 } : prev.position,
        size: newIsMaximized 
          ? { width: window.innerWidth, height: window.innerHeight }
          : prev.size
      };
    });
  }, []);

  // Add event listeners for drag and resize
  useEffect(() => {
    if (state.isDragging) {
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleDragEnd);
      document.addEventListener('pointermove', handleMove);
      document.addEventListener('pointerup', handleDragEnd);
    }
    if (state.isResizing) {
      document.addEventListener('mousemove', handleResize);
      document.addEventListener('mouseup', handleResizeEnd);
      document.addEventListener('pointermove', handleResize);
      document.addEventListener('pointerup', handleResizeEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleDragEnd);
      document.removeEventListener('pointermove', handleMove);
      document.removeEventListener('pointerup', handleDragEnd);
      document.removeEventListener('mousemove', handleResize);
      document.removeEventListener('mouseup', handleResizeEnd);
      document.removeEventListener('pointermove', handleResize);
      document.removeEventListener('pointerup', handleResizeEnd);
    };
  }, [state.isDragging, state.isResizing, handleMove, handleResize, handleDragEnd, handleResizeEnd]);

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
      cursor: state.isDragging ? 'grabbing' : state.isResizing ? 'nwse-resize' : 'default'
    }
  };
}; 