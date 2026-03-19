'use client'

import { ProcesStatus } from '@/lib/types'
import { pipelineSteps } from '@/lib/mock-data'

interface PipelineTrackerProps {
  currentStatus: ProcesStatus
  isRejected?: boolean
}

export default function PipelineTracker({ currentStatus, isRejected }: PipelineTrackerProps) {
  const currentIndex = pipelineSteps.findIndex(s => s.key === currentStatus)

  return (
    <div className="flex items-center gap-0 overflow-x-auto pb-2">
      {pipelineSteps.map((step, i) => {
        const isCompleted = i < currentIndex
        const isCurrent = step.key === currentStatus
        const isPast = i <= currentIndex

        return (
          <div key={step.key} className="flex items-center flex-shrink-0">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 transition-all ${
                isRejected && isCurrent
                  ? 'bg-red-100 border-red-400 text-red-600'
                  : isCurrent
                    ? 'bg-cyan/20 border-cyan text-cyan scale-110'
                    : isCompleted
                      ? 'bg-green-100 border-green-400 text-green-600'
                      : 'bg-surface-muted border-surface-border text-ink-muted'
              }`}>
                {isRejected && isCurrent ? '✕' : isCompleted ? '✓' : step.icon}
              </div>
              <p className={`text-[10px] mt-1 text-center max-w-[70px] leading-tight ${
                isCurrent ? 'text-ink font-semibold' : isPast ? 'text-ink-light' : 'text-ink-muted'
              }`}>
                {isRejected && isCurrent ? 'Afgewezen' : step.label}
              </p>
            </div>
            {i < pipelineSteps.length - 1 && (
              <div className={`w-6 h-0.5 mx-1 mt-[-14px] ${
                isCompleted ? 'bg-green-400' : 'bg-surface-border'
              }`} />
            )}
          </div>
        )
      })}
    </div>
  )
}
