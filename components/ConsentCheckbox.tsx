'use client'

interface ConsentCheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  documentName: string
  documentUrl: string
  version?: string
  required?: boolean
}

export default function ConsentCheckbox({ checked, onChange, documentName, documentUrl, version = '1.0', required = true }: ConsentCheckboxProps) {
  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 w-4 h-4 rounded border-purple/30 bg-surface-muted accent-cyan flex-shrink-0"
        required={required}
      />
      <span className="text-sm text-ink-light group-hover:text-ink transition-colors">
        Ik ga akkoord met de{' '}
        <a href={documentUrl} target="_blank" rel="noopener noreferrer" className="text-cyan underline hover:text-cyan/80">
          {documentName}
        </a>
        <span className="text-ink-faint text-xs ml-1">(v{version})</span>
      </span>
    </label>
  )
}
