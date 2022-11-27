const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");


const drawing = (e)=>{
    ctx.lineTo(e.offsetX, e.offsetY);           //Creates a new line with paramters x-coordinhate and y-coordinate
} 


canvas.addEventListener("mousemove", drawing);