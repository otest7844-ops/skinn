let skyImage: HTMLImageElement | undefined

export function drawMemoSky(ctx: CanvasRenderingContext2D, width: number, height: number) {
  skyImage ??= new Image()
  if (!skyImage.src) skyImage.src = '/images/memo-sky.svg'

  if (skyImage.complete && skyImage.naturalWidth > 0) {
    ctx.drawImage(skyImage, 0, 0, width, height)
    return
  }

  const sky = ctx.createLinearGradient(0, 0, 0, height)
  sky.addColorStop(0, '#7fdcfa')
  sky.addColorStop(1, '#4fcaf5')
  ctx.fillStyle = sky
  ctx.fillRect(0, 0, width, height)
}
