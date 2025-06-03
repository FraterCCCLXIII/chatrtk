import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed z-50 grid w-full max-w-lg gap-4 border bg-background p-6 shadow-lg duration-200",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "sm:rounded-lg",
        "cursor-move",
        "overflow-y-auto max-h-[90vh]",
        className
      )}
      onPointerDown={(e) => {
        if (e.button !== 0) return;
        
        const target = e.target as HTMLElement;
        const dialog = target.closest('[role="dialog"]') as HTMLElement;
        if (!dialog) return;

        // Don't initiate drag if clicking on interactive elements or their containers
        if (target.closest('button, a, input, select, textarea, [role="switch"], [data-no-drag]')) return;

        // Prevent default to avoid text selection during drag
        e.preventDefault();
        
        const startX = e.clientX;
        const startY = e.clientY;
        
        // Get the current position, accounting for transform
        let startLeft = 0;
        let startTop = 0;
        
        try {
          const rect = dialog.getBoundingClientRect();
          startLeft = rect.left;
          startTop = rect.top;
          
          // If dialog already has explicit position, use that instead
          if (dialog.style.left && dialog.style.top) {
            startLeft = parseInt(dialog.style.left) || startLeft;
            startTop = parseInt(dialog.style.top) || startTop;
          }
        } catch (err) {
          console.error('Error getting dialog position:', err);
          // Fallback to transform if getBoundingClientRect fails
          const transform = getComputedStyle(dialog).transform;
          if (transform && transform !== 'none') {
            try {
              // Extract translation values from matrix
              const matrix = new DOMMatrix(transform);
              startLeft = matrix.m41; // translateX value
              startTop = matrix.m42;  // translateY value
            } catch (err) {
              console.error('Error parsing transform matrix:', err);
              // Fallback to left/top if matrix parsing fails
              startLeft = parseInt(getComputedStyle(dialog).left) || 0;
              startTop = parseInt(getComputedStyle(dialog).top) || 0;
            }
          } else {
            // Fallback to left/top if no transform
            startLeft = parseInt(getComputedStyle(dialog).left) || 0;
            startTop = parseInt(getComputedStyle(dialog).top) || 0;
          }
        }

        // Set initial position
        dialog.style.left = `${startLeft}px`;
        dialog.style.top = `${startTop}px`;
        dialog.style.transform = 'none'; // Remove transform to prevent conflicts
        dialog.style.position = 'fixed'; // Ensure fixed positioning

        const handlePointerMove = (e: PointerEvent) => {
          const dx = e.clientX - startX;
          const dy = e.clientY - startY;
          
          // Apply new position directly
          dialog.style.left = `${startLeft + dx}px`;
          dialog.style.top = `${startTop + dy}px`;
          
          // Prevent text selection during drag
          e.preventDefault();
        };

        const handlePointerUp = () => {
          document.removeEventListener('pointermove', handlePointerMove);
          document.removeEventListener('pointerup', handlePointerUp);
        };

        document.addEventListener('pointermove', handlePointerMove);
        document.addEventListener('pointerup', handlePointerUp);
      }}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
