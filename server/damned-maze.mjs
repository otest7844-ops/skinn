const TILE_SIZE = 2
const DIRECTIONS = [[2, 0], [-2, 0], [0, 2], [0, -2]]
const WALK_DIRECTIONS = [[1, 0], [-1, 0], [0, 1], [0, -1]]

function randomSource(seed) {
  let value = seed >>> 0 || 1
  return () => {
    value ^= value << 13
    value ^= value >>> 17
    value ^= value << 5
    return (value >>> 0) / 0x100000000
  }
}

function mazeSeed(seed, level) {
  let value = (seed ^ Math.imul(level, 0x9e3779b9)) >>> 0
  value ^= value >>> 16
  value = Math.imul(value, 0x7feb352d) >>> 0
  value ^= value >>> 15
  return value || 1
}

function makeLevel(seed, level) {
  const random = randomSource(seed)
  const size = Math.min(11 + level, 17)
  const width = 2 * size + 1
  const half = (width - 1) / 2
  const shape = (level - 1) % 4
  const theme = (level - 1) % 3
  const inside = (x, y) => {
    const a = (x - half) / half
    const b = (y - half) / half
    if (shape === 0) return true
    if (shape === 1) return a * a + b * b <= 1.02
    if (shape === 2) return Math.abs(a) + Math.abs(b) <= 1.08
    return Math.abs(a) <= 0.62
  }

  const startX = size % 2 ? size : size + 1
  let startY = width - 2
  let exitY = 1
  while (startY > 1 && !inside(startX, startY)) startY -= 2
  while (exitY < width - 2 && !inside(startX, exitY)) exitY += 2

  const grid = Array.from({ length: width }, () => Array(width).fill(1))
  const stack = [[startX, startY]]
  grid[startY][startX] = 0
  while (stack.length) {
    const [x, y] = stack[stack.length - 1]
    const choices = DIRECTIONS.filter(([dx, dy]) => {
      const nextX = x + dx
      const nextY = y + dy
      return nextX > 0 && nextY > 0 && nextX < width - 1 && nextY < width - 1
        && grid[nextY][nextX] && inside(nextX, nextY)
    })
    if (!choices.length) {
      stack.pop()
      continue
    }
    const [dx, dy] = choices[Math.floor(random() * choices.length)]
    grid[y + dy / 2][x + dx / 2] = 0
    grid[y + dy][x + dx] = 0
    stack.push([x + dx, y + dy])
  }

  for (let index = 0; index < Math.max(5, 26 - 3 * level); index += 1) {
    const x = 1 + Math.floor(random() * (width - 2))
    const y = 1 + Math.floor(random() * (width - 2))
    if (grid[y][x] && ((x % 2 === 0) !== (y % 2 === 0))) {
      const [dx, dy] = x % 2 ? [0, 1] : [1, 0]
      if (grid[y - dy][x - dx] === 0 && grid[y + dy][x + dx] === 0) grid[y][x] = 0
    }
  }
  for (let y = startY + 1; y < width; y += 1) grid[y][startX] = 0
  for (let y = 0; y < exitY; y += 1) grid[y][startX] = 0

  return {
    seed,
    level,
    width,
    shape,
    theme,
    startX,
    startY,
    exitX: startX,
    exitY,
    grid,
  }
}

function tileAt(maze, x, z) {
  return [
    Math.round(x / TILE_SIZE),
    Math.round(z / TILE_SIZE),
  ]
}

function findPath(maze, startX, startY, targetX, targetY) {
  const { grid, width } = maze
  if (grid[startY]?.[startX] !== 0 || grid[targetY]?.[targetX] !== 0) return null
  const key = (x, y) => y * width + x
  const start = key(startX, startY)
  const target = key(targetX, targetY)
  const previous = new Map([[start, -1]])
  const queue = [[startX, startY]]
  for (let index = 0; index < queue.length; index += 1) {
    const [x, y] = queue[index]
    if (x === targetX && y === targetY) break
    for (const [dx, dy] of WALK_DIRECTIONS) {
      const nextX = x + dx
      const nextY = y + dy
      if (grid[nextY]?.[nextX] === 0 && !previous.has(key(nextX, nextY))) {
        previous.set(key(nextX, nextY), key(x, y))
        queue.push([nextX, nextY])
      }
    }
  }
  if (!previous.has(target)) return null
  const path = []
  for (let current = target; current !== start; current = previous.get(current)) {
    path.push([current % width, Math.floor(current / width)])
  }
  return path.reverse()
}

function makeMonsterPositions(maze, random) {
  const floors = []
  for (let y = 1; y < maze.width - 1; y += 1) {
    for (let x = 1; x < maze.width - 1; x += 1) {
      if (maze.grid[y][x] !== 0) continue
      const path = findPath(maze, maze.startX, maze.startY, x, y)
      if (path?.length > 12) floors.push([x, y])
    }
  }
  const monsters = []
  for (let index = 0; index < Math.min(2 + maze.level, 8) && floors.length; index += 1) {
    const [x, y] = floors.splice(Math.floor(random() * floors.length), 1)[0]
    monsters.push({
      id: index,
      x: x * TILE_SIZE,
      z: y * TILE_SIZE,
      vx: 0,
      vz: 0,
      phase: 0,
      goal: null,
      memory: 0,
      path: [],
      speed: 2.6,
    })
  }
  return { monsters, floors }
}

function createLevel(seed, level, players) {
  const maze = makeLevel(seed, level)
  const random = randomSource(seed ^ 0xa5a5a5a5)
  const { monsters, floors } = makeMonsterPositions(maze, random)
  const spawnX = maze.startX * TILE_SIZE
  const spawnZ = maze.startY * TILE_SIZE
  players.forEach((player, slot) => {
    player.x = spawnX + (slot === 0 ? -0.35 : 0.35)
    player.z = spawnZ
    player.vx = 0
    player.vz = 0
    player.rotation = Math.PI
    player.input = { x: 0, z: 0 }
    player.invulnerable = 2
    player.status = 'playing'
    player.reachedPortal = false
    player.level = level
  })
  return { maze, monsters, floors, randomState: seed ^ 0x63d83595 }
}

export function createDamnedMazeState(seed = 1) {
  const players = [0, 1].map(() => ({
    x: 0,
    z: 0,
    vx: 0,
    vz: 0,
    rotation: Math.PI,
    lives: 3,
    invulnerable: 2,
    status: 'playing',
    reachedPortal: false,
    level: 1,
    input: { x: 0, z: 0 },
  }))
  const initial = createLevel(seed, 1, players)
  return {
    game: 'damned-maze',
    status: 'playing',
    winner: null,
    result: null,
    level: 1,
    elapsedSeconds: 0,
    aiElapsed: 0,
    seed: seed >>> 0,
    maze: initial.maze,
    players,
    monsters: initial.monsters,
    floorTiles: initial.floors,
    randomState: initial.randomState >>> 0 || 1,
  }
}

function nextRandom(state) {
  let value = state.randomState >>> 0 || 1
  value ^= value << 13
  value ^= value >>> 17
  value ^= value << 5
  state.randomState = value >>> 0 || 1
  return state.randomState / 0x100000000
}

function isWall(maze, x, z) {
  const [tileX, tileY] = tileAt(maze, x, z)
  return maze.grid[tileY]?.[tileX] !== 0
}

function blocked(maze, x, z, radius = 0.42) {
  const [tileX, tileY] = tileAt(maze, x, z)
  for (let row = tileY - 1; row <= tileY + 1; row += 1) {
    for (let column = tileX - 1; column <= tileX + 1; column += 1) {
      if (maze.grid[row]?.[column] === 0) continue
      const closestX = Math.max(column * TILE_SIZE - TILE_SIZE / 2,
        Math.min(x, column * TILE_SIZE + TILE_SIZE / 2))
      const closestZ = Math.max(row * TILE_SIZE - TILE_SIZE / 2,
        Math.min(z, row * TILE_SIZE + TILE_SIZE / 2))
      const dx = x - closestX
      const dz = z - closestZ
      if (dx * dx + dz * dz < radius * radius) return true
    }
  }
  return false
}

function moveEntity(state, entity, deltaX, deltaZ, radius = 0.42) {
  const steps = Math.max(1, Math.ceil(Math.max(Math.abs(deltaX), Math.abs(deltaZ)) / 0.1))
  const stepX = deltaX / steps
  const stepZ = deltaZ / steps
  for (let index = 0; index < steps; index += 1) {
    const nextX = entity.x + stepX
    if (!blocked(state.maze, nextX, entity.z, radius)) entity.x = nextX
    else {
      entity.vx = 0
      break
    }
  }
  for (let index = 0; index < steps; index += 1) {
    const nextZ = entity.z + stepZ
    if (!blocked(state.maze, entity.x, nextZ, radius)) entity.z = nextZ
    else {
      entity.vz = 0
      break
    }
  }
}

function hasLineOfSight(maze, x1, z1, x2, z2) {
  const distance = Math.hypot(x2 - x1, z2 - z1)
  const steps = Math.ceil(distance / 0.4)
  for (let index = 1; index < steps; index += 1) {
    const amount = index / steps
    if (isWall(maze, x1 + (x2 - x1) * amount, z1 + (z2 - z1) * amount)) return false
  }
  return true
}

function movePlayer(state, player, dt) {
  const inputLength = Math.hypot(player.input.x, player.input.z)
  const inputX = inputLength > 1 ? player.input.x / inputLength : player.input.x
  const inputZ = inputLength > 1 ? player.input.z / inputLength : player.input.z
  const blend = 1 - Math.exp(-dt * 70)
  player.vx += (inputX * 7.6 - player.vx) * blend
  player.vz += (inputZ * 7.6 - player.vz) * blend
  moveEntity(state, player, player.vx * dt, player.vz * dt)
  if (Math.hypot(player.vx, player.vz) > 0.3) player.rotation = Math.atan2(player.vx, player.vz)
}

function moveMonster(state, monster, dt) {
  const [tileX, tileY] = tileAt(state.maze, monster.x, monster.z)
  if (monster.path.length) {
    const [targetX, targetY] = monster.path[0]
    const dx = targetX * TILE_SIZE - monster.x
    const dz = targetY * TILE_SIZE - monster.z
    const distance = Math.hypot(dx, dz)
    if (distance < 0.25) monster.path.shift()
    else {
      const blend = 1 - Math.exp(-dt * 9)
      monster.vx += (dx / distance * monster.speed - monster.vx) * blend
      monster.vz += (dz / distance * monster.speed - monster.vz) * blend
      moveEntity(state, monster, monster.vx * dt, monster.vz * dt)
      return
    }
  }
  monster.vx *= Math.exp(-dt * 8)
  monster.vz *= Math.exp(-dt * 8)
  if (!state.maze.grid[tileY]?.[tileX]) return
  monster.path = []
}

function updateMonsterGoals(state) {
  const maze = state.maze
  for (const monster of state.monsters) {
    const [tileX, tileY] = tileAt(maze, monster.x, monster.z)
    let target = null
    let targetDistance = 3 + 0.2 * Math.min(state.level, 8)
    for (const player of state.players) {
      if (player.status !== 'playing' || player.invulnerable > 0) continue
      const distance = Math.hypot(player.x - monster.x, player.z - monster.z)
      if (distance < targetDistance && hasLineOfSight(maze, monster.x, monster.z, player.x, player.z)) {
        target = player
        targetDistance = distance
      }
    }
    if (target) {
      const [goalX, goalY] = tileAt(maze, target.x, target.z)
      monster.goal = [goalX, goalY]
      monster.memory = 4
      monster.speed = 4.8 + 0.05 * Math.min(state.level, 8)
    } else {
      monster.memory = Math.max(0, monster.memory - 0.4)
      if (monster.memory <= 0) {
        if (monster.goal && Math.hypot(monster.goal[0] - tileX, monster.goal[1] - tileY) > 0) {
          monster.speed = 4 + 0.05 * Math.min(state.level, 8)
        } else {
          monster.goal = null
          monster.speed = 2.6
        }
      }
    }
    if (!monster.goal) {
      const floor = state.floorTiles[Math.floor(nextRandom(state) * state.floorTiles.length)]
      if (floor) monster.goal = floor
    }
    if (monster.goal && (monster.goal[0] !== tileX || monster.goal[1] !== tileY)) {
      monster.path = findPath(maze, tileX, tileY, monster.goal[0], monster.goal[1]) ?? []
    } else {
      monster.path = []
    }
  }
}

function finish(state, winner) {
  state.status = 'finished'
  state.winner = winner
  state.result = winner === null ? 'draw' : 'win'
  state.players.forEach((player, slot) => {
    player.status = winner === null ? 'dead' : slot === winner ? 'won' : 'dead'
    player.input = { x: 0, z: 0 }
  })
}

function advanceLevel(state) {
  state.level += 1
  state.players.forEach((player) => { player.lives = Math.min(3, player.lives + 1) })
  const next = createLevel(mazeSeed(state.seed, state.level), state.level, state.players)
  state.maze = next.maze
  state.monsters = next.monsters
  state.floorTiles = next.floors
  state.randomState = next.randomState >>> 0 || 1
}

export function applyDamnedMazeInput(state, slot, input) {
  const player = state?.players?.[slot]
  if (state?.status !== 'playing' || !player || player.status !== 'playing'
    || !Number.isFinite(input?.x) || !Number.isFinite(input?.z)
    || Math.abs(input.x) > 1 || Math.abs(input.z) > 1) return false
  player.input = { x: input.x, z: input.z }
  return true
}

export function tickDamnedMaze(state, dt) {
  if (state.status !== 'playing') return
  const step = Math.min(0.05, Math.max(0, dt))
  state.elapsedSeconds += step
  state.aiElapsed += step
  for (const player of state.players) {
    if (player.status !== 'playing') continue
    player.invulnerable = Math.max(0, player.invulnerable - step)
    movePlayer(state, player, step)
    const portalX = state.maze.exitX * TILE_SIZE
    if (Math.hypot(player.x - portalX, player.z) < 1.3) {
      player.status = 'portal'
      player.reachedPortal = true
      player.input = { x: 0, z: 0 }
    }
  }

  if (state.aiElapsed >= 0.4) {
    state.aiElapsed %= 0.4
    updateMonsterGoals(state)
  }
  for (const monster of state.monsters) moveMonster(state, monster, step)

  for (const player of state.players) {
    if (player.status !== 'playing' || player.invulnerable > 0) continue
    if (!state.monsters.some((monster) => Math.hypot(player.x - monster.x, player.z - monster.z) < 0.9)) continue
    player.lives -= 1
    player.invulnerable = 2.5
    player.input = { x: 0, z: 0 }
    if (player.lives <= 0) {
      finish(state, state.players[1 - state.players.indexOf(player)].status === 'dead' ? null : 1 - state.players.indexOf(player))
      return
    }
    const { startX, startY } = state.maze
    player.x = startX * TILE_SIZE + (state.players.indexOf(player) === 0 ? -0.35 : 0.35)
    player.z = startY * TILE_SIZE
    player.vx = 0
    player.vz = 0
  }

  if (state.players.every((player) => player.status === 'portal')) advanceLevel(state)
}
