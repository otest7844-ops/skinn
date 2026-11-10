import type { SyntheticEvent } from 'react'

const imageWidths: Record<string, number> = {
  '/images/memo-5x5.jpg': 736,
  '/images/football-19.jpg': 507,
  '/images/tape-tape-arena.jpg': 450,
  '/images/basketball-stars.jpg': 736,
  '/images/game-tic-tac-toe.jpg': 512,
  '/images/game-ping-pong.jpg': 736,
  '/images/game-ball-rush.jpg': 512,
  '/images/mosswing-online.jpg': 241,
  '/images/forest-bridge.jpg': 736,
  '/images/princess-race.jpg': 736,
  '/images/damned-maze.jpg': 736,
  '/images/casino-slots.jpg': 735,
  '/images/roulette.jpg': 720,
  '/images/jackpot-arcade.jpg': 400,
  '/images/royal-slots.jpg': 640,
  '/images/top-performer-01.jpg': 736,
  '/images/top-performer-02.jpg': 720,
  '/images/top-performer-03.jpg': 736,
  '/images/top-performer-04.jpg': 736,
  '/images/top-performer-05.jpg': 735,
  '/images/top-performer-06.jpg': 736,
  '/images/top-performer-07.jpg': 736,
  '/images/top-performer-08.jpg': 736,
  '/images/top-performer-09.jpg': 736,
  '/images/top-performer-10.jpg': 736,
}

export function getResponsiveImageProps(
  src: string,
  sizes: string,
  candidateWidths: readonly number[] = [320, 400, 640],
) {
  const originalWidth = imageWidths[src]
  if (!originalWidth) return { src, sizes }

  const variants = candidateWidths.filter((width) => width <= originalWidth)
  const sources = variants.map((width) => {
    const variantSrc = src
      .replace('/images/', '/images/responsive/')
      .replace(/\.jpg$/, `-${width}.jpg`)
    return `${variantSrc} ${width}w`
  })

  if (!variants.includes(originalWidth)) sources.push(`${src} ${originalWidth}w`)

  return {
    src: variants.length
      ? src.replace('/images/', '/images/responsive/').replace(/\.jpg$/, `-${variants[0]}.jpg`)
      : src,
    srcSet: sources.length ? sources.join(', ') : undefined,
    sizes,
  }
}

export function hideBrokenImage(event: SyntheticEvent<HTMLImageElement>) {
  event.currentTarget.hidden = true
}
