import { RNG, Cell, World } from './index'

const { FLOOR, WALL } = World.tileIds

let rng = RNG.create()

export default { create }

function create(size) {

  let area = size * size
  let center = (size - 1) / 2
  let world = World.create(size).fill()

  let data = world.data

  let i = area
  while (i--) {
    let cell, [x, y] = cell = Cell.fromIndex(i, size)
    let id = FLOOR
    if (Cell.isEdge(cell, size) && x !== center && y !== center || x === center && y === center)
      id = WALL
    data[i] = id
  }

  return world

}
