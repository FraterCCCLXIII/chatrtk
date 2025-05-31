import React, { useCallback, useState } from 'react';

interface ResizeHandleProps {
  onResize: (newHeight: number) => void;
  minHeight?: number;
  maxHeight?: number;
}

const ResizeHandle: React.FC<ResizeHandleProps> = ({ 
  onResize, 
  minHeight = 200, 
  maxHeight = 600 
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      // Calculate new height with min/max constraints
      const newHeight = Math.max(minHeight, Math.min(maxHeight, moveEvent.clientY - 100));
      onResize(newHeight);
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [onResize, minHeight, maxHeight]);

  return (
    <div 
      className="resize-handle"
      onMouseDown={handleMouseDown}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      <div className="resize-handle-line"></div>
    </div>
  );
};

export default ResizeHandle; 