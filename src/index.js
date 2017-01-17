import { Cell, World, Dungeon, Alpha, Image, Display } from './utils/index'

const WORLD_SIZE = 9

const { FLOOR, WALL } = World.tileIds

let display = Display.create([320, 240])
let world = Dungeon.create(WORLD_SIZE)

Image.load(['floor.png', 'wall.png', 'shadow.png'], setup)

function setup(sprites) {
  display.mount('#app')

  let [floor, wall, shadow] = sprites = Alpha.process(sprites, 'magenta')

  let sprite = floor

  let size = WORLD_SIZE
  let area = size * size

  for (let i = 0; i < area; i++) {

    let cell, [cx, cy] = cell = Cell.fromIndex(i, size)
    let id = world.data[i]
    let sprite = sprites[id]

    let elevation = getIsoElevation(sprite)
    let [x, y] = getIsoPos(cell, sprite.width)

    x += display.width  / 2
    y += display.height / 2 - (size / 2 + elevation) * sprite.width / 2

    display.context.drawImage(sprite, x, y)
    if (id === FLOOR && world.getAt([cx - 1, cy]) === WALL)
      display.context.drawImage(shadow, x, y)

  }

  loop()

}

function loop() {

}

function getIsoPos(cell, tileSize) {
  let [x, y] = cell
  return [ (x - y - 1) * tileSize / 2, (x + y) * tileSize / 4 ]
}

function getIsoElevation(sprite) {
   return (sprite.height - sprite.width / 2) / (sprite.width / 2)
}
