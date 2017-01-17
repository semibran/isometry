import { Alpha, Image, Display } from './utils/index'

const WORLD_SIZE = 9

let display = Display.create([320, 240])
let world = new Uint8ClampedArray(WORLD_SIZE * WORLD_SIZE)

Image.load(['floor.png', 'wall.png'], setup)

function setup(sprites) {
  display.mount('#app')

  let [floor, wall] = sprites = Alpha.process(sprites, 'magenta')

  let tileWidth  = floor.width / 2
  let tileHeight = tileWidth / 2

  let size = WORLD_SIZE
  let area = size * size
  for (let i = 0; i < area; i++) {
    let x = i % size
    let y = (i - x) / size
    if (!x || !y || x === size - 1 || y === size - 1)
      world[i] = 1
    let id = world[i]
    let sprite = sprites[id]
    let elevation = (sprite.height - tileWidth) / tileHeight - 1
    display.context.drawImage(sprite, display.width / 2 + (x - y - 1) * tileWidth, display.height / 2 + (x + y - elevation) * tileHeight - size / 2 * tileWidth)
  }
  loop()
}

function loop() {

}
