import * as React from "react"
import { X, Maximize2, Minimize2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useWindowManager } from "@/hooks/useWindowManager"

export interface WindowProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number; height: number };
  minSize?: { width: number; height: number };
  maxSize?: { width: number; height: number };
  onPositionChange?: (position: { x: number; y: number }) => void;
  onSizeChange?: (size: { width: number; height: number }) => void;
  onClose?: () => void;
  zIndex?: number;
}

const Window = React.forwardRef<HTMLDivElement, WindowProps>(({
  className,
  children,
  title = "Window",
  initialPosition,
  initialSize,
  minSize,
  maxSize,
  onPositionChange,
  onSizeChange,
  onClose,
  zIndex = 50,
  ...props
}, ref) => {
  const {
    state,
    handleDragStart,
    handleResizeStart,
    toggleMaximize,
    style: windowStyle
  } = useWindowManager({
    initialPosition,
    initialSize,
    minSize,
    maxSize,
    onPositionChange,
    onSizeChange
  });

  return (
    <div
      ref={ref}
      className={cn(
        "fixed z-50 flex flex-col bg-background border shadow-lg duration-200",
        state.isMaximized ? "rounded-none" : "rounded-lg",
        className
      )}
      style={{
        ...windowStyle,
        zIndex
      }}
      {...props}
    >
      {/* Window Title Bar */}
      <div 
        className="flex items-center justify-between border-b px-4 py-2 bg-muted/50 cursor-move"
        onPointerDown={handleDragStart}
      >
        <h2 className="text-sm font-semibold text-foreground/90">{title}</h2>
        <div className="flex items-center gap-1">
          <button
            onClick={toggleMaximize}
            className="p-1 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
          >
            {state.isMaximized ? (
              <Minimize2 className="h-3 w-3" />
            ) : (
              <Maximize2 className="h-3 w-3" />
            )}
            <span className="sr-only">
              {state.isMaximized ? "Restore" : "Maximize"}
            </span>
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Close</span>
            </button>
          )}
        </div>
      </div>

      {/* Window Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>

      {/* Resize Handles */}
      {!state.isMaximized && (
        <>
          {/* Top Left */}
          <div
            className="absolute top-0 left-0 w-4 h-4 cursor-nwse-resize"
            onPointerDown={(e) => handleResizeStart(e, 'nw')}
          />
          {/* Top Right */}
          <div
            className="absolute top-0 right-0 w-4 h-4 cursor-nesw-resize"
            onPointerDown={(e) => handleResizeStart(e, 'ne')}
          />
          {/* Bottom Left */}
          <div
            className="absolute bottom-0 left-0 w-4 h-4 cursor-nesw-resize"
            onPointerDown={(e) => handleResizeStart(e, 'sw')}
          />
          {/* Bottom Right */}
          <div
            className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize"
            onPointerDown={(e) => handleResizeStart(e, 'se')}
          />
        </>
      )}
    </div>
  )
})
Window.displayName = "Window"

export { Window } 