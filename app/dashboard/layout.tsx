import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { BarChart3, Link2, LayoutDashboard, PlusCircle } from 'lucide-react'
import { ThemeToggle } from '@/components/layout/theme-toggle'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card fixed inset-y-0 z-40">
        <div className="h-16 flex items-center gap-2 px-6 border-b border-border">
          <Link2 className="h-5 w-5 text-primary" />
          <span className="font-bold text-lg">LinkShort</span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-border">
          <Link
            href="/dashboard/links/new"
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors justify-center"
          >
            <PlusCircle className="h-4 w-4" />
            リンクを作成
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 md:ml-64 flex flex-col">
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-2 md:hidden">
            <Link2 className="h-5 w-5 text-primary" />
            <span className="font-bold">LinkShort</span>
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <UserButton />
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}

const navItems = [
  { href: '/dashboard', label: 'ダッシュボード', icon: LayoutDashboard },
  { href: '/dashboard/links', label: 'リンク一覧', icon: Link2 },
  { href: '/dashboard/analytics', label: '解析', icon: BarChart3 },
]
