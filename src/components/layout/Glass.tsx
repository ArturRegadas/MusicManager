import { cn } from "../../lib/utils"

export function Glass({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        `
        bg-white/10
        backdrop-blur-xl
        border border-white/20
        shadow-xl
        rounded-2xl
        transition-all
        `,
        className
      )}
      {...props}
    />
  )
}
