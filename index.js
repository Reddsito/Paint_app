const inputRange = document.querySelector('.bar__input'),
canvas = document.querySelector('canvas'),
board = document.querySelector('.board'),
ctx = canvas.getContext("2d"),
toolsBtns = document.querySelectorAll('.tool'),
fillColor = document.querySelector('#fill-color'),
colorBtns = document.querySelectorAll('.bar__colors .bar__field'),
colorPicker = document.querySelector('#color-picker'),
clearCanvas = document.querySelector('.bar__button-clear'),
saveImg = document.querySelector('.bar__button-save'),
mediaQueryList = window.matchMedia("screen and (max-width: 1040px)");

let isDrawing = false,
activeTool = "Brush",
selectedColor = "#000",
prevMouseX, prevMouseY, snapshot

if(mediaQueryList.matches) {
  clearCanvas.innerText = "Clear"
  saveImg.innerText = "Save"
} else {
  clearCanvas.innerText = "Clear Canvas"
  saveImg.innerText = "Save as Image"
}

window.onresize = () => {
  if(mediaQueryList.matches) {
    clearCanvas.innerText = "Clear"
    saveImg.innerText = "Save"
  } else {
    clearCanvas.innerText = "Clear Canvas"
    saveImg.innerText = "Save as Image"
  }
}
window.addEventListener("load", () => {
    //setting canvas width/height.. offsetwidth/height returns viewable width/height of an element.
    canvas.width = canvas.offsetWidth; 
    canvas.height = canvas.offsetHeight;
    setCanvasBackground() 
})


inputRange.addEventListener('input', handleInputChange)

toolsBtns.forEach(tool => {
  tool.addEventListener('click', () => {
    document.querySelector('.bar__field.--active').classList.remove("--active")
    activeTool = tool.id
    tool.classList.add("--active")
  })
})

colorBtns.forEach( color => {
  color.addEventListener("click", () => {
    document.querySelector('.bar__field.--selected').classList.remove("--selected")
    color.classList.add('--selected')

    // passing selected btn bg color as selectedColor value
    selectedColor = window.getComputedStyle(color).getPropertyValue("background-color")
    
  })
})

colorPicker.addEventListener('change', () => {
  colorPicker.parentElement.style.background = colorPicker.value

  colorPicker.parentElement.click();
})

clearCanvas.addEventListener("click", () => {
    ctx.clearRect(0,0, canvas.width, canvas.height)
})

saveImg.addEventListener("click", () => {
  const link = document.createElement("a")
  link.download = `${Date.now()}.jpg` //passing current date as link download value
  link.href = canvas.toDataURL() // passing canvasData as link href value
  link.click() //clicking link to download image
})

canvas.addEventListener('mousemove', drawing)
canvas.addEventListener('mousedown', startDraw)
canvas.addEventListener('mouseup', () => {
    isDrawing = false;
})


function handleInputChange(e) {
    let target = e.target
    if (e.target.type !== 'range') {
      target = document.getElementById('range')
    } 
    const min = target.min
    const max = target.max
    const val = target.value
    target.style.backgroundSize = (val - min) * 100 / (max - min) + '% 100%'
  }

  function setCanvasBackground() {
    ctx.fillStyle = "#fff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = selectedColor;
  }

  function drawRect(e) {
      if(!fillColor.checked) {
        // creating circle according to the mouse pointer
        return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX,prevMouseY - e.offsetY )
    
      }

      ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX,prevMouseY - e.offsetY )
  }

  function drawCircle(e) {
    ctx.beginPath(); //creating new path to draw circle
    // getting radius for circle according to the mouse pointer
      let radius = Math.sqrt(Math.pow( (prevMouseX - e.offsetX), 2) + Math.pow( (prevMouseY - e.offsetY), 2))

      ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI) //create circle according to the mouse pointer

      fillColor.checked ? ctx.fill() : ctx.stroke()
        //if fillcolor checked, fill circle.
    
  }
  function drawTriangle(e) {
    ctx.beginPath(); //creating new path to draw Triangle
    ctx.moveTo(prevMouseX, prevMouseY) // moving triangle to the mouse pointer
    ctx.lineTo(e.offsetX, e.offsetY) //creating first line according to the mouse pointer
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY) // creating bottom line
    ctx.closePath() // closing path, so the third line draw automatically
    fillColor.checked ? ctx.fill() : ctx.stroke()

  }

  function drawLine(e) {
    ctx.beginPath(); //creating new path to draw Triangle
    ctx.moveTo(prevMouseX, prevMouseY) // moving triangle to the mouse pointer
    ctx.lineTo(e.offsetX, e.offsetY) //creating first line according to the mouse pointer
    ctx.stroke()

  }

  function startDraw(e) {
    isDrawing = true;
    ctx.beginPath(); // create a new path to draw
    ctx.lineWidth = inputRange.value;
    ctx.strokeStyle = selectedColor;
    ctx.fillStyle = selectedColor;
    prevMouseX = e.offsetX
    prevMouseY = e.offsetY
    // copying canvas data and passing as snapshot value  -this avoids dragging/ the image
    snapshot = ctx.getImageData(0,0, canvas.width, canvas.height)
  }

  function drawing(e) {
    if(!isDrawing) return;

    // adding copied canvas data on to this canvas
    ctx.putImageData(snapshot, 0, 0)

    if(activeTool === "Brush" || activeTool === "Eraser") {
      
      ctx.strokeStyle = activeTool === "Eraser" ? "#fff" : selectedColor

      ctx.lineTo(e.offsetX, e.offsetY) //Creating line according to the mouse pointer
      ctx.stroke() //Draw or fill line with color
    } else if (activeTool === "Rectangle") {
        drawRect(e);  
    } else if (activeTool === "Circle") {
        drawCircle(e)
    } else if (activeTool === "Triangle") {
        drawTriangle(e)
    } else if (activeTool === "Line") {
        drawLine(e)
    }

  }

