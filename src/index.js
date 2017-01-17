import { Alpha, Image, Display } from './utils/index'

let display = Display.create([320, 240])

Image.load(['floor.png', 'wall.png'], setup)

function setup(sprites) {
  display.mount('#app')

  let floor = Alpha.process('magenta', sprites.floor)

  let width  = 16
  let height = 8

  let side = 8
  let area = side * side
  for (let i = 0; i < area; i++) {
    let x = i % side
    let y = (i - x) / side
    display.context.drawImage(floor, display.width / 2 + (x - y - 1) * width, display.height / 2 + (x + y) * height - side / 2 * width)
  }
  loop()
}

function loop() {

}
