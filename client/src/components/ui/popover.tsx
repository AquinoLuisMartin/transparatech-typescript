import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PopoverContextValue {
  open: boolean;
  setOpen: (v: boolean) => void;
}

const PopoverContext = createContext<PopoverContextValue | null>(null);

export const Popover: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  return (
    <PopoverContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block">{children}</div>
    </PopoverContext.Provider>
  );
};

export const PopoverTrigger: React.FC<{ children: ReactNode; asChild?: boolean; className?: string }> = ({ children, className }) => {
  const ctx = useContext(PopoverContext);
  if (!ctx) return <>{children}</>;
  const { setOpen } = ctx;
  return (
    <div onClick={() => setOpen(true)} className={`inline-block ${className || ''}`}>
      {children}
    </div>
  );
};

export const PopoverContent: React.FC<{ children: ReactNode; className?: string }> = ({ children, className }) => {
  const ctx = useContext(PopoverContext);
  if (!ctx) return <>{children}</>;
  const { open, setOpen } = ctx;
  return (
    <div
      className={`${open ? 'block' : 'hidden'} absolute z-50 mt-2 ${className || ''}`}
      onMouseLeave={() => setOpen(false)}
    >
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-md border border-gray-200 dark:border-gray-700 p-2">
        {children}
      </div>
    </div>
  );
};

export default Popover;
