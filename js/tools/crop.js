// js/tools/crop.js

import { getEditor, saveHistory,logTool,setToolBar } from '../editor-core.js';

let isCropping = false;
let startX = 0, startY = 0;
let endX = 0, endY = 0;
let activeHandle = null;
let sourceImage = null;

const HANDLE_SIZE = 14;

export function showCropPanel() {

    logTool("Crop panel opened");

    setToolBar(
        "Crop",
        "cancelCrop()",
        "applyCrop()"
    );
   
    sourceImage = new Image();

sourceImage.onload = () => {
    initCrop();
};
    sourceImage.onerror = () => {
    alert("Failed to load image");
};

sourceImage.src =
    getEditor().state.history[
        getEditor().state.historyIndex
    ];
}

function initCrop() {
    const { canvas } = getEditor();

    canvas.style.cursor = "crosshair";
    canvas.removeEventListener('pointerdown', startCrop);
    canvas.removeEventListener('pointermove', drawCrop);
    canvas.removeEventListener('pointerup', endCrop);
    canvas.removeEventListener('pointermove', hoverCrop);

    canvas.addEventListener('pointerdown', startCrop);
    canvas.addEventListener('pointermove', drawCrop);
    canvas.addEventListener('pointerup', endCrop);
    canvas.addEventListener("pointermove",hoverCrop);
}
function updateCursor(pos) {

    const { canvas } = getEditor();

    const handle = getHandleAt(
        pos.x,
        pos.y
    );

    if (handle === "tl" || handle === "br")
    canvas.style.cursor = "nwse-resize";

else if (
    handle === "tr" ||
    handle === "bl"
)
    canvas.style.cursor = "nesw-resize";
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
    if (!sourceImage) return;
    if (!isCropping) return;

    const { canvas, ctx } = getEditor();
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
    


        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(sourceImage, 0, 0);

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
    sourceImage,
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
}


function endCrop(e) {
    const { canvas } = getEditor();
    activeHandle = getHandleAt(pos.x, pos.y);

    isCropping = false;


    if (e.pointerId !== undefined) {
        canvas.releasePointerCapture(e.pointerId);
    }
    activeHandle = null;
}

window.applyCrop = () => {
    if (!sourceImage) return;
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
    tctx.drawImage(sourceImage, x, y, w, h, 0, 0, w, h);

    canvas.width = w;
    canvas.height = h;
    ctx.drawImage(temp, 0, 0);

    saveHistory();
    logTool(`Crop applied ${Math.round(w)}x${Math.round(h)}`);
    resetCrop();
    cleanup();
};

window.cancelCrop = () => {

    const { canvas, ctx } = getEditor();

    restoreImage();
    logTool("Crop cancelled");

    resetCrop();

    cleanup();
};

window.closeCrop = () => {
    
    const { canvas, ctx } = getEditor();

    restoreImage();
    
    logTool("Crop closed");
    resetCrop();
    cleanup();
    
};

function cleanup() {
    isCropping = false;
    const { canvas } = getEditor();

    canvas.style.cursor = "default";

    canvas.removeEventListener('pointerdown', startCrop);
    canvas.removeEventListener('pointermove', drawCrop);
    canvas.removeEventListener('pointerup', endCrop);
    canvas.removeEventListener('pointermove',hoverCrop);

    

}

function drawHandles(x, y, w, h) {

    const { ctx } = getEditor();
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

    const left = Math.min(startX, endX);
    const top = Math.min(startY, endY);
    const width = Math.abs(endX - startX);
    const height = Math.abs(endY - startY);

    const handles = {
        tl: [left, top],
        tr: [left + width, top],
        bl: [left, top + height],
        br: [left + width, top + height]
    };

    for (const key in handles) {

        const [hx, hy] = handles[key];

        const dx = x - hx;
        const dy = y - hy;

        if (
        (dx * dx + dy * dy)< HANDLE_SIZE*
            HANDLE_SIZE
        ) {
            return key;
        }
    }

    return null;
}
function hoverCrop(e) {

    if (isCropping) return;

    const { canvas } = getEditor();

    const pos = getPos(e, canvas);

    updateCursor(pos);
}

function resetCrop() {

    startX = 0;
    startY = 0;
    endX = 0;
    endY = 0;
    activeHandle = null;
    sourceImage = null;
}
function restoreImage() {

    if (!sourceImage) return;

    const { canvas, ctx } = getEditor();

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.drawImage(
        sourceImage,
        0,
        0,
        sourceImage.width,
        sourceImage.height
    );
}
