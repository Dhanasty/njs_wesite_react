import { cn } from '../utils/cn'

const LoadingSpinner = ({ 
  size = 'md', 
  className = '', 
  text = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <div
        className={cn(
          'border-2 border-current border-r-transparent rounded-full animate-spin text-primary-600',
          sizeClasses[size]
        )}
      />
      {text && (
        <p className="mt-2 text-sm text-neutral-600">{text}</p>
      )}
    </div>
  )
}

export default LoadingSpinner