import { Image, Display } from './utils/index'

let display = Display.create([320, 240])

Image.load('tile.png', setup)

function setup(tile) {
  display.mount('#app')
  let width  = tile.width  / 2
  let height = tile.height / 2
  let side = 8
  let area = side * side
  for (let i = area; i--;) {
    let x = i % side
    let y = (i - x) / side
    display.context.drawImage(tile, display.width / 2 + (x - y - 1) * width, display.height / 2 + (x + y) * height - side / 2 * width)
  }
  loop()
}

function loop() {

}
