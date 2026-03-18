import React, { useState, useEffect, useCallback } from 'react';

interface SidebarResizerProps {
  onResize: (width: number) => void;
  config: any;
  setConfig: React.Dispatch<React.SetStateAction<any>>;
}

export default function SidebarResizer({ onResize, config, setConfig }: SidebarResizerProps) {
  const [isDragging, setIsDragging] = useState(false);

  const startDragging = (e: React.MouseEvent) => {
    setIsDragging(true);
    e.preventDefault();
  };

  const stopDragging = useCallback(() => {
    setIsDragging(false);
  }, []);

  const onDrag = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;

      const newWidth = Math.max(250, Math.min(600, e.clientX));
      onResize(newWidth);
    },
    [isDragging, onResize]
  );

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', onDrag);
      document.addEventListener('mouseup', stopDragging);
    } else {
      document.removeEventListener('mousemove', onDrag);
      document.removeEventListener('mouseup', stopDragging);
    }

    return () => {
      document.removeEventListener('mousemove', onDrag);
      document.removeEventListener('mouseup', stopDragging);
    };
  }, [isDragging, onDrag, stopDragging]);

  const resetWidth = () => {
    setConfig({ ...config, sidebarWidth: 384 });
  };

  return (
    <div
      className={`w-1 cursor-col-resize absolute right-0 top-0 bottom-0 z-50 group hover:bg-zinc-900/50 transition-colors ${
        isDragging ? 'bg-zinc-900' : 'bg-transparent'
      }`}
      onMouseDown={startDragging}
      onDoubleClick={resetWidth}
      title="Drag to resize, double click to reset"
    >
      <div className="absolute top-1/2 -mt-4 -ml-1 flex flex-col gap-1 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-1 h-1 bg-white/50 rounded-full"></div>
        <div className="w-1 h-1 bg-white/50 rounded-full"></div>
        <div className="w-1 h-1 bg-white/50 rounded-full"></div>
      </div>
    </div>
  );
}
