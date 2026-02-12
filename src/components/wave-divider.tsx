interface WaveDividerProps {
  position?: "top" | "bottom"
  fromColor?: string
  toColor?: string
  className?: string
  variant?: "gentle" | "organic" | "subtle" | "swoosh"
  height?: number
}

export function WaveDivider({
  position = "bottom",
  fromColor,
  toColor = "hsl(var(--background))",
  className = "",
  variant = "gentle",
  height,
}: WaveDividerProps) {
  const isTop = position === "top"

  const defaultHeight = variant === "subtle" ? 40 : variant === "swoosh" ? 80 : 56

  const paths = {
    gentle: "M0,40 C240,65 480,20 720,45 C960,70 1200,25 1440,50 L1440,100 L0,100 Z",
    organic: "M0,55 C180,70 360,30 540,50 C720,70 900,25 1080,48 C1200,60 1360,38 1440,50 L1440,100 L0,100 Z",
    subtle: "M0,70 C360,85 720,55 1080,70 C1260,78 1440,65 1440,65 L1440,100 L0,100 Z",
    swoosh: "M0,65 C120,72 360,25 600,40 C840,55 960,80 1200,35 C1320,18 1400,42 1440,38 L1440,100 L0,100 Z",
  }

  return (
    <div
      className={`absolute left-0 right-0 w-full overflow-hidden pointer-events-none ${
        isTop ? "top-0 -mt-px" : "bottom-0 -mb-px"
      } ${className}`}
      style={{
        transform: isTop ? "rotate(180deg)" : undefined,
        height: `${height || defaultHeight}px`,
      }}
      aria-hidden="true"
    >
      <svg
        className="absolute bottom-0 w-full"
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        style={{ height: "100%", width: "100%" }}
      >
        {fromColor && (
          <defs>
            <linearGradient id={`wave-grad-${variant}-${position}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={fromColor} stopOpacity="0.5" />
              <stop offset="100%" stopColor={toColor} />
            </linearGradient>
          </defs>
        )}
        <path
          d={paths[variant]}
          fill={fromColor ? `url(#wave-grad-${variant}-${position})` : toColor}
        />
      </svg>
    </div>
  )
}
