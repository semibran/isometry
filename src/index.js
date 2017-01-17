import { Alpha, Image, Display } from './utils/index'

const WORLD_SIZE = 9

let display = Display.create([320, 240])
let world = new Uint8ClampedArray(WORLD_SIZE * WORLD_SIZE)

Image.load(['floor.png', 'wall.png', 'shadow.png'], setup)

function setup(sprites) {
  display.mount('#app')

  let [floor, wall, shadow] = sprites = Alpha.process(sprites, 'magenta')

  let tileWidth  = floor.width / 2
  let tileHeight = tileWidth / 2

  let size = WORLD_SIZE
  let area = size * size
  for (let i = 0; i < area; i++) {
    let cx = i % size
    let cy = (i - cx) / size
    if ((!cx || !cy || cx === size - 1 || cy === size - 1) && cx !== 4 && cy !== 4)
      world[i] = 1
    let id = world[i]
    let sprite = sprites[id]
    let elevation = (sprite.height - tileWidth) / tileHeight - 1
    let x = display.width  / 2 + (cx - cy - 1) * tileWidth
    let y = display.height / 2 + (cx + cy) * tileHeight - size / 2 * tileWidth
    display.context.drawImage(sprite, x, y - elevation * tileHeight)
    if (world[i] !== 0 || cx - 1 < 0 || world[cy * size + cx - 1] !== 1)
      continue
    display.context.drawImage(shadow, x, y)
  }
  loop()
}

function loop() {

}
