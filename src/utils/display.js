export default { create }

function create(size) {

  let [width, height] = size

  let canvas  = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  let context = canvas.getContext('2d')

  return {
    width, height, context,
    mount, clear, render
  }

  function mount(element) {
    if (typeof element === 'string')
      element = document.querySelector(element)
    if (!element)
      throw new TypeError(`Cannot mount display on element ${element}`)
    element.appendChild(canvas)
    clear()
  }

  function clear() {
    context.fillStyle = 'black'
    context.fillRect(0, 0, width, height)
  }

  function render() {

  }

}
