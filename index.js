const canvas = document.querySelector("canvas");
const toolBtns = document.querySelectorAll(".tool");
const ctx = canvas.getContext("2d");



// Global Variables with default values
let isDrawing = false;
let brushWidth = 5;
let selectedTool = "brush";
let prevMouseX, prevMouseY, snapshot;




window.addEventListener("load", ()=>{
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
});




const drawing = (e)=>{
    if(! isDrawing) return;                     //  If is Drawing is false then ret8urn from here
    ctx.putImageData(snapshot, 0, 0);           //  Adding copied canvas data on this canvas

    if(selectedTool === "brush")
    {
        ctx.lineTo(e.offsetX, e.offsetY);           //  Creates a new line with paramters x-coordinhate and y-coordinate
        ctx.stroke();                               //  Drawing/filling line with color
    }
    else if(selectedTool === "rectangle")
    {
        drawRect(e);
    }
    
} 



//   To start drawing when the mouse is clicked
const startDraw = (e)=>{
    isDrawing = true;
    prevMouseX = e.offsetX;                     //  Passing the current mouse position
    prevMouseY = e.offsetY;
    ctx.beginPath();                            //  Starts Drawing from the mouse pointer and does not join the end points 
    ctx.lineWidth = brushWidth;                 //  Changing the brush size

    // copying canvas data and passing as snapshot value, this avoids dragging the image.
    snapshot = ctx.getImageData(0 ,0, canvas.width, canvas.height);
}




toolBtns.forEach(btn => {
    btn.addEventListener("click", ()=>{         //  Adding click event to all tool options
        // Removing active class from previously selected option and adding it to the currently selected option
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;
        console.log(selectedTool);
    });
});




const drawRect = (e) => {
    ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
}




canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => isDrawing = false );       // To stop drawing when the mouse click is removed