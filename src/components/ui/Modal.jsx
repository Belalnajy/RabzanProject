import React from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, subtitle, className = "max-w-xl", children, footer, hideHeader = false }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#040814]/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className={`bg-white rounded-[32px] w-full ${className} shadow-xl flex flex-col max-h-[95vh] border border-gray-200 overflow-hidden`}>
        
        {/* Header */}
        {!hideHeader && (
          <div className={`flex items-start justify-between p-6 md:px-8 ${children ? 'border-b border-gray-100' : ''}`}>
             <button onClick={onClose} className="text-[#040814] hover:bg-gray-100 p-2 rounded-full transition-colors shrink-0">
               <X size={24} strokeWidth={2.5} />
             </button>
             <div className="text-right">
               {title && <h2 className="text-xl font-black text-[#040814]">{title}</h2>}
               {subtitle && <p className="text-gray-400 text-sm font-medium mt-1">{subtitle}</p>}
             </div>
          </div>
        )}
        
        {/* Content */}
        {children && (
          <div className="p-6 md:px-8 overflow-y-auto custom-scrollbar flex-1 text-right">
             {children}
          </div>
        )}
        
        {/* Footer */}
        {footer && (
          <div className="p-6 md:px-8 border-t border-gray-100 flex gap-4 flex-row-reverse">
             {footer}
          </div>
        )}
      </div>
    </div>
  );
}
