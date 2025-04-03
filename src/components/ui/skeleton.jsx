function Skeleton({ className, ...props }) {
    return <div className={`animate-pulse rounded-md bg-zinc-800/70 ${className || ""}`} {...props} />
  }
  
  export { Skeleton }
  
  