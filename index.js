const canvas = document.querySelector("canvas");
const toolBtns = document.querySelectorAll(".tool");
const fillColor = document.querySelector("#fill-color");
const sizeSlider = document.querySelector("#size-slider");
const colorBtns = document.querySelectorAll(".colors .option");
const colorPicker = document.querySelector("#color-picker");
const clearCanvas = document.querySelector(".clear-canvas");
const saveImage = document.querySelector(".save-img");
const ctx = canvas.getContext("2d");



// Global Variables with default values
let isDrawing = false;
let brushWidth = 5;
let selectedColor = "#000";
let selectedTool = "brush";
let prevMouseX, prevMouseY, snapshot;




window.addEventListener("load", ()=>{
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground();
});




const setCanvasBackground = () => {

    // Setting the whole canvas to white so that the download image will have the white background
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor;              //  setting the brush color back to selected color
}




const drawing = (e)=>{
    if(! isDrawing) return;                     //  If is Drawing is false then ret8urn from here
    ctx.putImageData(snapshot, 0, 0);           //  Adding copied canvas data on this canvas

    if(selectedTool === "brush" || selectedTool === "eraser")
    {
        // If selected color is eraser then the stroke style will be white
        // Doing so will create the erasing effect on the canvas by painting white on the screen
        ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;

        ctx.lineTo(e.offsetX, e.offsetY);           //  Creates a new line with paramters x-coordinhate and y-coordinate
        ctx.stroke();                               //  Drawing/filling line with color
    }
    else if(selectedTool === "rectangle")
    {
        drawRect(e);
    }
    else if(selectedTool === "circle")
    {
        drawCircle(e);
    }
    else  
    {
        drawTriangle(e);
    }
    
} 



//   To start drawing when the mouse is clicked
const startDraw = (e)=>{
    isDrawing = true;
    prevMouseX = e.offsetX;                     //  Passing the current mouse position
    prevMouseY = e.offsetY;
    ctx.beginPath();                            //  Starts Drawing from the mouse pointer and does not join the end points 
    ctx.lineWidth = brushWidth;                 //  Changing the brush size

    // Changing the stroke and fill style of the brush to the user selected value
    ctx.strokeStyle = selectedColor;
    ctx.fillStyle = selectedColor;

    // copying canvas data and passing as snapshot value, this avoids dragging the image.
    snapshot = ctx.getImageData(0 ,0, canvas.width, canvas.height);
}




toolBtns.forEach(btn => {
    btn.addEventListener("click", ()=>{         //  Adding click event to all tool options
        // Removing active class from previously selected option and adding it to the currently selected option
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;
    });
});






colorBtns.forEach(btn => {
    btn.addEventListener("click", ()=>{         //  Adding click event to all color buttons
        // Removing active class from previously selected option and adding it to the currently selected option
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");

        // Passing selected btn background color value as the selectedColor Value for brush
        selectedColor =  window.getComputedStyle(btn).getPropertyValue("background-color");
    });
});






// Passing size slider value as brush size
sizeSlider.addEventListener("change", () => brushWidth = sizeSlider.value);         




const drawRect = (e) => {

    // if  fillcolor is not checked then the draw the rect with the borders
    if(!fillColor.checked){
        // creating rectangle according to mouse pointer
        return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    }

    // draws the rectangle with color filled
    ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
}




const drawCircle = (e) => {

    ctx.beginPath();            //Creating a new pathto draw a circle
    // Getting radius for circle according to mouse pointer
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + ((prevMouseY - e.offsetY), 2));

    ctx.arc(prevMouseX , prevMouseY, radius, 0, 2*Math.PI);
    fillColor.checked ? ctx.fill() : ctx.stroke();
}




const drawTriangle = (e) => {

    ctx.beginPath();            //Creating a new pathto draw a triangle
    ctx.moveTo(prevMouseX, prevMouseY);     //Moving triangle to mouse pointer
    ctx.lineTo(e.offsetX, e.offsetY);       //Creating first line according to mouse pointer
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);      //Creating the bottom line of triangle
    ctx.closePath();        //Closing the path of the triangle so that the third line automatically draws
    fillColor.checked ? ctx.fill() : ctx.stroke();
}




colorPicker.addEventListener("change", ()=>{
    // passing the picked color value from the picker to be used as the brush color
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
});




clearCanvas.addEventListener("click", ()=>{
    ctx.clearRect(0, 0, canvas.width, canvas.height);           //  Clearing whole canvas
    setCanvasBackground();
});




saveImage.addEventListener("click", ()=>{
    const link = document.createElement("a");
    link.download = `${Date.now()}.jpg`;
    link.href = canvas.toDataURL();
    link.click();
});




canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => isDrawing = false );       // To stop drawing when the mouse click is removed