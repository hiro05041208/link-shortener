import { LinkForm } from '@/components/links/link-form'

export default function NewLinkPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">新しいリンクを作成</h1>
        <p className="text-muted-foreground mt-1">URLを短縮して共有しましょう</p>
      </div>
      <LinkForm />
    </div>
  )
}
