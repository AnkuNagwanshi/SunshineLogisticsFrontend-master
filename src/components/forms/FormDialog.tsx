import * as React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { X } from 'lucide-react'

interface FormDialogProps {
  isOpen: boolean
  onClose: () => void
  title: string | React.ReactNode
  description?: string | React.ReactNode
  children: React.ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl'
  className?: string
  showCloseButton?: boolean
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
  '6xl': 'max-w-6xl',
  '7xl': 'max-w-7xl'
}

export function FormDialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = '2xl',
  className = '',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true
}: FormDialogProps) {
  const handleOpenChange = (open: boolean) => {
    if (!open && closeOnOverlayClick) {
      onClose()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && closeOnEscape) {
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className={`
          w-full ${maxWidthClasses[maxWidth]} 
          overflow-hidden 
          bg-white 
          shadow-2xl 
          border-0 
          rounded-2xl
          p-0
          ${className}
        `}
        onKeyDown={handleKeyDown}
      >
        {/* Custom Header with Close Button */}
        <div className="relative">
          {showCloseButton && (
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-10 p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200 group"
              aria-label="Close dialog"
            >
              <X className="h-4 w-4 text-gray-500 group-hover:text-gray-700" />
            </button>
          )}

          <DialogHeader className="px-6 pt-6 pb-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
            <DialogTitle className="text-2xl font-bold text-gray-900 pr-12">
              {typeof title === 'string' ? (
                <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">{title}</span>
              ) : (
                title
              )}
            </DialogTitle>
            {description && <DialogDescription className="text-base text-gray-600 mt-2 leading-relaxed">{description}</DialogDescription>}
          </DialogHeader>
        </div>

        {/* Scrollable Content Area */}
        <div className="px-6 py-6 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">{children}</div>
      </DialogContent>
    </Dialog>
  )
}
