import assert from 'node:assert/strict'
import test from 'node:test'
import { applyDamnedMazeInput, createDamnedMazeState, tickDamnedMaze } from './damned-maze.mjs'

function isReachable(maze) {
  const queue = [[maze.startX, maze.startY]]
  const visited = new Set([`${maze.startX},${maze.startY}`])
  for (let index = 0; index < queue.length; index += 1) {
    const [x, y] = queue[index]
    if (x === maze.exitX && y === maze.exitY) return true
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx
      const ny = y + dy
      const key = `${nx},${ny}`
      if (maze.grid[ny]?.[nx] === 0 && !visited.has(key)) {
        visited.add(key)
        queue.push([nx, ny])
      }
    }
  }
  return false
}

function overlapsWall(maze, x, z, radius = 0.42) {
  for (let row = 0; row < maze.width; row += 1) {
    for (let column = 0; column < maze.width; column += 1) {
      if (maze.grid[row][column] === 0) continue
      const closestX = Math.max(column * 2 - 1, Math.min(x, column * 2 + 1))
      const closestZ = Math.max(row * 2 - 1, Math.min(z, row * 2 + 1))
      if ((x - closestX) ** 2 + (z - closestZ) ** 2 < radius ** 2 - 1e-8) return true
    }
  }
  return false
}

test('generates the same connected maze and demon positions from a shared seed', () => {
  const first = createDamnedMazeState(0x12345678)
  const second = createDamnedMazeState(0x12345678)

  assert.deepEqual(first.maze, second.maze)
  assert.deepEqual(first.monsters, second.monsters)
  assert.ok(isReachable(first.maze))
  assert.equal(first.maze.grid[first.maze.startY][first.maze.startX], 0)
  assert.equal(first.maze.grid[first.maze.exitY][first.maze.exitX], 0)
})

test('accepts only bounded movement vectors and authoritatively moves the player', () => {
  const state = createDamnedMazeState(42)
  const player = state.players[0]
  const { grid, startX, startY } = state.maze
  const direction = [
    { x: 1, z: 0, dx: 1, dy: 0, axis: 'x' },
    { x: -1, z: 0, dx: -1, dy: 0, axis: 'x' },
    { x: 0, z: 1, dx: 0, dy: 1, axis: 'z' },
    { x: 0, z: -1, dx: 0, dy: -1, axis: 'z' },
  ].find(({ dx, dy }) => grid[startY + dy]?.[startX + dx] === 0)
  assert.ok(direction)

  const start = { x: player.x, z: player.z }
  assert.equal(applyDamnedMazeInput(state, 0, { x: direction.x, z: direction.z }), true)
  assert.equal(applyDamnedMazeInput(state, 0, { x: 2, z: 0 }), false)
  assert.equal(applyDamnedMazeInput(state, 0, { x: Number.NaN, z: 0 }), false)
  for (let step = 0; step < 20; step += 1) tickDamnedMaze(state, 0.05)

  assert.ok(Math.hypot(player.x - start.x, player.z - start.z) > 0.1)
  assert.ok(player.x >= 0)
  assert.ok(player.x < state.maze.width * 2)
})

test('prevents a player from crossing maze walls while holding a direction', () => {
  const state = createDamnedMazeState(0xabc123)
  const player = state.players[0]
  player.invulnerable = 100
  const { grid, width } = state.maze
  let wallApproach = null
  for (let y = 1; y < width - 1 && !wallApproach; y += 1) {
    for (let x = 1; x < width - 1 && !wallApproach; x += 1) {
      if (grid[y][x] !== 0) continue
      const direction = [
        { x: 1, z: 0, dx: 1, dy: 0, axis: 'x' },
        { x: -1, z: 0, dx: -1, dy: 0, axis: 'x' },
        { x: 0, z: 1, dx: 0, dy: 1, axis: 'z' },
        { x: 0, z: -1, dx: 0, dy: -1, axis: 'z' },
      ].find(({ dx, dy }) => grid[y + dy]?.[x + dx] === 1)
      if (direction) wallApproach = { x, y, direction }
    }
  }
  assert.ok(wallApproach)
  player.x = wallApproach.x * 2
  player.z = wallApproach.y * 2
  assert.equal(applyDamnedMazeInput(state, 0, wallApproach.direction), true)
  for (let index = 0; index < 80; index += 1) {
    tickDamnedMaze(state, 0.05)
    assert.equal(grid[Math.round(player.z / 2)]?.[Math.round(player.x / 2)], 0)
    assert.equal(overlapsWall(state.maze, player.x, player.z), false)
  }
  const wallX = (wallApproach.x + wallApproach.direction.dx) * 2
  const wallZ = (wallApproach.y + wallApproach.direction.dy) * 2
  const wallFace = wallApproach.direction.axis === 'x'
    ? Math.abs(player.x - wallX)
    : Math.abs(player.z - wallZ)
  assert.ok(wallFace >= 1 + 0.42 - 0.11)
})

test('shares damage, portal progress, and terminal results in server state', () => {
  const state = createDamnedMazeState(123)
  const player = state.players[0]
  const demon = state.monsters[0]
  demon.x = player.x
  demon.z = player.z
  demon.speed = 0
  player.invulnerable = 0
  tickDamnedMaze(state, 0.05)
  assert.equal(player.lives, 2)

  state.players.forEach((entry) => {
    entry.x = state.maze.exitX * 2
    entry.z = 0
    entry.input = { x: 0, z: 0 }
  })
  tickDamnedMaze(state, 0.05)
  assert.equal(state.level, 2)
  assert.equal(state.players[0].level, 2)
  assert.equal(state.players[1].level, 2)

  const nextPlayer = state.players[0]
  const nextDemon = state.monsters[0]
  nextDemon.x = nextPlayer.x
  nextDemon.z = nextPlayer.z
  nextDemon.speed = 0
  nextPlayer.lives = 1
  nextPlayer.invulnerable = 0
  tickDamnedMaze(state, 0.05)
  assert.equal(state.status, 'finished')
  assert.equal(state.winner, 1)
  assert.equal(state.result, 'win')
})
