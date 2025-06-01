import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ModalWrapperProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const ModalWrapper: React.FC<ModalWrapperProps> = ({
  open,
  onOpenChange,
  title,
  icon,
  children,
  className = "max-w-4xl"
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={className}>
        {title && (
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              {icon}
              {title}
            </DialogTitle>
          </DialogHeader>
        )}
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default ModalWrapper; 