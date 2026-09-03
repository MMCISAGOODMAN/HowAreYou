import type { Profile } from './types'

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines: number) {
  const chars = [...text]
  const lines: string[] = []
  let current = ''
  for (const ch of chars) {
    const next = current + ch
    if (ctx.measureText(next).width > maxWidth && current) {
      lines.push(current)
      current = ch
      if (lines.length === maxLines) return lines
    } else {
      current = next
    }
  }
  if (current && lines.length < maxLines) lines.push(current)
  return lines
}

export function downloadShareCard(profile: Profile) {
  const canvas = document.createElement('canvas')
  canvas.width = 1200
  canvas.height = 630
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.fillStyle = '#f4efe6'
  ctx.fillRect(0, 0, 1200, 630)
  ctx.fillStyle = '#c45c26'
  ctx.fillRect(0, 0, 1200, 18)
  ctx.fillRect(0, 612, 1200, 18)

  ctx.fillStyle = '#c45c26'
  ctx.font = '600 28px "Avenir Next", "PingFang SC", sans-serif'
  ctx.fillText('HOW ARE YOU', 72, 88)

  ctx.fillStyle = '#2c2419'
  ctx.font = '600 48px "Iowan Old Style", "Songti SC", serif'
  const quote = profile.headline || `@${profile.id}`
  const lines = wrap(ctx, quote, 1050, 4)
  lines.forEach((line, i) => {
    ctx.fillText(line, 72, 220 + i * 64)
  })

  ctx.fillStyle = '#6f6456'
  ctx.font = '400 28px "Avenir Next", "PingFang SC", sans-serif'
  ctx.fillText(`@${profile.id}`, 72, 540)
  ctx.fillText('开发者的真实状态', 820, 540)

  canvas.toBlob((blob) => {
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `how-are-you-@${profile.id}.png`
    a.click()
    URL.revokeObjectURL(url)
  }, 'image/png')
}
