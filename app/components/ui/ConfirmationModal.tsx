import React from "react";
import { Check, X, } from "lucide-react";
import { Button } from "./Button";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDestructive = false,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white border border-zinc-200 rounded-[14px] w-full max-w-[400px] shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-5">
          <div className="flex items-start gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isDestructive ? 'bg-red-100 text-red-600' : 'bg-zinc-100 text-zinc-900'}`}>
              <Check size={20} />
            </div>
            
            <div className="flex-1">
              <h3 className="text-[16px] font-bold text-zinc-900 tracking-tight mb-1.5">
                {title}
              </h3>
              <p className="text-[13px] text-zinc-500 leading-relaxed">
                {message}
              </p>
            </div>
          </div>
        </div>

        <div className="px-5 py-4 bg-zinc-50 border-t border-zinc-200 flex justify-end gap-2.5">
          <Button 
            variant="secondary" 
            onClick={onClose}
            className="text-[13px] py-1.5"
          >
            {cancelText}
          </Button>
          <Button 
            variant={isDestructive ? "danger" : "primary"} 
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="text-[13px] py-1.5"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
