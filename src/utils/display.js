export default { create }

function create(size) {

  let [width, height] = size

  let canvas  = document.createElement('canvas')
  let context = canvas.getContext('2d')

  return {
    width, height, context,
    mount, render
  }

  function mount(element) {
    if (typeof element === 'string')
      element = document.querySelector('element')
    element.appendChild(canvas)
  }

  function render() {

  }

}
