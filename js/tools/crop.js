// js/tools/crop.js

import { getEditor, saveHistory } from '../editor-core.js';

let isCropping = false;
let startX = 0, startY = 0;
let endX = 0, endY = 0;

export function showCropPanel() {
    const panel = document.getElementById('tool-panel');
    panel.innerHTML = `
        <div class="flex justify-between items-center mb-4">
            <div class="font-medium">Crop Tool</div>
            <button onclick="closeCrop()" class="text-2xl text-zinc-400">×</button>
        </div>

        <div class="text-xs text-zinc-400 mb-4">
            Drag on image to select crop area
        </div>

        <button onclick="applyCrop()" 
            class="w-full py-3 mb-3 bg-violet-600 hover:bg-violet-700 rounded-2xl text-sm font-medium">
            Apply Crop
        </button>

        <button onclick="cancelCrop()" 
            class="w-full py-3 text-sm font-medium bg-zinc-800 hover:bg-zinc-700 rounded-2xl">
            Cancel
        </button>
    `;

    initCrop();
}

function initCrop() {
    const { canvas } = getEditor();

    canvas.style.cursor = "crosshair";

    canvas.addEventListener('pointerdown', startCrop);
    canvas.addEventListener('pointermove', drawCrop);
    canvas.addEventListener('pointerup', endCrop);
}

function getPos(e, canvas) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: (e.clientX - rect.left) * (canvas.width / rect.width),
        y: (e.clientY - rect.top) * (canvas.height / rect.height)
    };
}

function startCrop(e) {
    const { canvas } = getEditor();
    canvas.setPointerCapture(e.pointerId);

    isCropping = true;
    const pos = getPos(e, canvas);
    
    startX = pos.x;
    startY = pos.y;

    endX = pos.x;
    endY = pos.y;
}

function drawCrop(e) {
    if (!isCropping) return;

    const { canvas, ctx, state } = getEditor();
    const pos = getPos(e, canvas);

    endX = pos.x;
    endY = pos.y;

    // redraw original image
    const img = new Image();
    img.src = state.history[state.historyIndex];

    img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        // draw selection box
const x = Math.min(startX, endX);
const y = Math.min(startY, endY);
const w = Math.abs(endX - startX);
const h = Math.abs(endY - startY);

// draw dark overlay
ctx.fillStyle = "rgba(0,0,0,0.55)";
ctx.fillRect(0, 0, canvas.width, canvas.height);

// reveal crop area
ctx.clearRect(x, y, w, h);

// redraw image inside crop area
ctx.drawImage(
    img,
    x, y, w, h,
    x, y, w, h
);

// crop border
ctx.strokeStyle = "#a78bfa";
ctx.lineWidth = 2;
ctx.setLineDash([6]);

ctx.strokeRect(x, y, w, h);
        
ctx.setLineDash([]);

for (let i = 1; i < 3; i++) {

    // vertical lines
    ctx.beginPath();
    ctx.moveTo(x + (w / 3) * i, y);
    ctx.lineTo(x + (w / 3) * i, y + h);
    ctx.stroke();

    // horizontal lines
    ctx.beginPath();
    ctx.moveTo(x, y + (h / 3) * i);
    ctx.lineTo(x + w, y + (h / 3) * i);
    ctx.stroke();
}
    };
}

function endCrop(e) {
    const { canvas } = getEditor();

    isCropping = false;

    if (e.pointerId !== undefined) {
        canvas.releasePointerCapture(e.pointerId);
    }
}

window.applyCrop = () => {
    const { canvas, ctx } = getEditor();

    const x = Math.min(startX, endX);
    const y = Math.min(startY, endY);
    const w = Math.abs(endX - startX);
    const h = Math.abs(endY - startY);

 if (w < 30 || h < 30) {
    alert("Crop area too small");
    return;
 }

    const temp = document.createElement("canvas");
    temp.width = w;
    temp.height = h;

    const tctx = temp.getContext("2d");
    tctx.drawImage(canvas, x, y, w, h, 0, 0, w, h);

    canvas.width = w;
    canvas.height = h;
    ctx.drawImage(temp, 0, 0);

    saveHistory();
    cleanup();
};

window.cancelCrop = () => {
    cleanup();
};

window.closeCrop = () => {
    cleanup();
};

function cleanup() {
    const { canvas } = getEditor();

    canvas.style.cursor = "default";

    canvas.removeEventListener('pointerdown', startCrop);
    canvas.removeEventListener('pointermove', drawCrop);
    canvas.removeEventListener('pointerup', endCrop);

    const panel = document.getElementById("tool-panel");
    panel.classList.remove("active");

    setTimeout(() => {
        panel.classList.add("hidden");
    }, 300);
}
