import type { PropsWithChildren } from "react"


export default function AppLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-wedshare-light-bg dark:bg-wedshare-dark-bg transition-colors">
      <main className="mx-auto max-w-7xl px-6 py-12">
        {children}
      </main>
    </div>
  )
}
