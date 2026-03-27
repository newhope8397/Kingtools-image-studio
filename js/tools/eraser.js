// js/eraser.js
let isErasing = false;
let lastX = 0, lastY = 0;
let eraserSize = 30;
let isRestoring = false;

const canvas = document.getElementById('main-canvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });

function initEraser() {
    canvas.addEventListener('touchstart', startErase);
    canvas.addEventListener('touchmove', doErase);
    canvas.addEventListener('touchend', stopErase);
    
    // Mouse support for desktop testing
    canvas.addEventListener('mousedown', startErase);
    canvas.addEventListener('mousemove', doErase);
    canvas.addEventListener('mouseup', stopErase);
}

function startErase(e) {
    isErasing = true;
    const pos = getCanvasPos(e);
    lastX = pos.x;
    lastY = pos.y;
}

function stopErase() {
    isErasing = false;
    saveToHistory(); // for undo later
}

function doErase(e) {
    if (!isErasing || !currentImage) return;
    
    const pos = getCanvasPos(e);
    ctx.save();
    
    if (isRestoring) {
        // Simple restore simulation (we'll improve with history)
        ctx.globalCompositeOperation = 'source-over';
    } else {
        ctx.globalCompositeOperation = 'destination-out'; // true erase
    }
    
    ctx.lineWidth = eraserSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    
    ctx.restore();
    
    lastX = pos.x;
    lastY = pos.y;
}

function getCanvasPos(e) {
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    
    if (e.touches) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }
    
    return {
        x: (clientX - rect.left) * (canvas.width / rect.width),
        y: (clientY - rect.top) * (canvas.height / rect.height)
    };
}

function setEraserSize(size) {
    eraserSize = Math.max(5, Math.min(100, size));
}

function toggleEraseMode(mode) {
    isRestoring = (mode === 'restore');
}

// Export functions so index.html can use them
window.initEraser = initEraser;
window.setEraserSize = setEraserSize;
window.toggleEraseMode = toggleEraseMode;
