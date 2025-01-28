import { CircularProgress } from '@mui/material'
import './ProcessingStatus.css'

type ProcessingStatusProps = {
  isProcessing: boolean
  status?: string
}

export function ProcessingStatus({ isProcessing, status }: ProcessingStatusProps) {
  if (!isProcessing) return null

  return (
    <div className="processing-status">
      <CircularProgress size={24} className="progress-spinner" />
      <span className="status-text">
        {status || 'Processing your content...'}
      </span>
    </div>
  )
} 