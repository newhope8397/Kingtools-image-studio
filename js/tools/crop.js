// js/tools/crop.js

import { getEditor, saveHistory,logTool } from '../editor-core.js';

let isCropping = false;
let startX = 0, startY = 0;
let endX = 0, endY = 0;
let activeHandle = null;

const HANDLE_SIZE = 14;
export function showCropPanel() {
    logTool("Crop panel opened");
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
    canvas.removeEventListener('pointerdown', startCrop);
    canvas.removeEventListener('pointermove', drawCrop);
    canvas.removeEventListener('pointerup', endCrop);

    canvas.addEventListener('pointerdown', startCrop);
    canvas.addEventListener('pointermove', drawCrop);
    canvas.addEventListener('pointerup', endCrop);
}
function updateCursor(pos) {

    const { canvas } = getEditor();

    const handle = getHandleAt(
        pos.x,
        pos.y
    );

    if (handle) {
        canvas.style.cursor = "nwse-resize";
    }
    else {
        canvas.style.cursor = "crosshair";
    }
}

function getPos(e, canvas) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: (e.clientX - rect.left) * (canvas.width / rect.width),
        y: (e.clientY - rect.top) * (canvas.height / rect.height)
    };
}

function startCrop(e) {
    logTool("Crop selection started");
    const { canvas } = getEditor();
    const pos = getPos(e, canvas);
    
    activeHandle =
    getHandleAt(pos.x, pos.y);
    canvas.setPointerCapture(e.pointerId);

if (activeHandle) {

    isCropping = true;
    return;
}

    isCropping = true;
    
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

if (activeHandle === "tl") {

    startX = pos.x;
    startY = pos.y;

}
else if (activeHandle === "tr") {

    endX = pos.x;
    startY = pos.y;

}
else if (activeHandle === "bl") {

    startX = pos.x;
    endY = pos.y;

}
else if (activeHandle === "br") {

    endX = pos.x;
    endY = pos.y;

}
else {

    endX = pos.x;
    endY = pos.y;

}

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
    drawHandles(x, y, w, h);
    };
}


function endCrop(e) {
    const { canvas } = getEditor();

    isCropping = false;

    activeHandle = null;

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
    logTool("Crop rejected: area too small");
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
    logTool(`Crop applied ${Math.round(w)}x${Math.round(h)}`);
startX = 0;
startY = 0;
endX = 0;
endY = 0;
activeHandle = null;
};

window.cancelCrop = () => {
startX = 0;
startY = 0;
endX = 0;
endY = 0;
activeHandle = null;
logTool("Crop cancelled");
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

function drawHandles(x, y, w, h) {

    const { ctx } = getEditor();
    updateCursor(pos)
    const handles = [

        [x, y],

        [x + w, y],

        [x, y + h],

        [x + w, y + h]
    ];

    handles.forEach(([hx, hy]) => {

        ctx.beginPath();

        ctx.arc(
            hx,
            hy,
            HANDLE_SIZE / 2,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = "#ffffff";
        ctx.fill();

        ctx.strokeStyle = "#a78bfa";
        ctx.lineWidth = 2;
        ctx.stroke();
    });
}

function getHandleAt(x, y) {
    if (
    startX === endX &&
    startY === endY
) {
    return null;
    }

    const handles = {
        tl: [startX, startY],
        tr: [endX, startY],
        bl: [startX, endY],
        br: [endX, endY]
    };

    for (const key in handles) {

        const [hx, hy] = handles[key];

        const dx = x - hx;
        const dy = y - hy;

        if (
            Math.sqrt(dx * dx + dy * dy)
            < HANDLE_SIZE
        ) {
            return key;
        }
    }

    return null;
}
