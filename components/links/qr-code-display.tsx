'use client'

import { useEffect, useState } from 'react'
import { Download, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface QrCodeDisplayProps {
  url: string
  slug: string
  linkId?: string
}

export function QrCodeDisplay({ url, slug, linkId }: QrCodeDisplayProps) {
  const [dataUrl, setDataUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!linkId) return
    setLoading(true)
    fetch(`/api/qr/${linkId}`)
      .then((r) => r.json())
      .then((d) => setDataUrl(d.dataUrl))
      .finally(() => setLoading(false))
  }, [linkId])

  function handleDownload() {
    if (!dataUrl) return
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = `qr-${slug}.png`
    a.click()
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-3">
        <div className="h-48 w-48 flex items-center justify-center bg-muted rounded-lg">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  if (!dataUrl && !linkId) {
    return (
      <div className="text-center text-sm text-muted-foreground">
        <p>リンクを作成するとQRコードが生成されます</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-3">
      {dataUrl && (
        <>
          <img
            src={dataUrl}
            alt={`QR Code for ${url}`}
            className="h-48 w-48 rounded-lg border border-border"
          />
          <p className="text-xs text-muted-foreground text-center">{url}</p>
          <Button variant="outline" size="sm" onClick={handleDownload} className="gap-2">
            <Download className="h-4 w-4" />
            ダウンロード
          </Button>
        </>
      )}
    </div>
  )
}
