export default function Card({ children, className = '', ...props }) {
  return (
    <div
      className={`bg-card border border-line rounded-card shadow-soft ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export function SectionHeading({ eyebrow, title, subtitle, action }) {
  return (
    <div className="flex items-end justify-between mb-4 gap-4">
      <div>
        {eyebrow && (
          <p className="text-[11px] font-semibold tracking-[0.12em] text-primary-500 uppercase mb-1">
            {eyebrow}
          </p>
        )}
        <h2 className="font-display text-xl text-ink">{title}</h2>
        {subtitle && <p className="text-sm text-ink-soft mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}
