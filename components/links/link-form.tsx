'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'

export function LinkForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const payload = {
      url: formData.get('url') as string,
      slug: formData.get('slug') as string,
      title: formData.get('title') as string,
    }

    try {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'エラーが発生しました')
        return
      }

      router.push('/dashboard/links')
      router.refresh()
    } catch {
      setError('ネットワークエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 space-y-5">
      <div className="space-y-2">
        <Label htmlFor="url">元のURL *</Label>
        <Input
          id="url"
          name="url"
          type="url"
          placeholder="https://example.com/very-long-url"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">タイトル（任意）</Label>
        <Input
          id="title"
          name="title"
          placeholder="リンクのわかりやすい名前"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">カスタムスラッグ（任意）</Label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground whitespace-nowrap">linkshort.io/</span>
          <Input
            id="slug"
            name="slug"
            placeholder="my-link"
            pattern="[a-zA-Z0-9_-]+"
            title="英数字、ハイフン、アンダースコアのみ使用できます"
          />
        </div>
        <p className="text-xs text-muted-foreground">空白の場合はランダムに生成されます</p>
      </div>

      {error && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">{error}</p>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={loading} className="gap-2">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          リンクを作成
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          キャンセル
        </Button>
      </div>
    </form>
  )
}
