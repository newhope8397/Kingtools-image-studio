// js/tools/crop.js

import { getEditor,logTool } from '../editor-core.js';
import { commitCanvas ,resizeCanvas } from "../core/canvas-engine.js";
import { openPanel } from "../core/panel-engine.js";

import { requireImage } from "../core/guard-engine.js";
import { getCanvasPos } from "../core/event-engine.js";
import { cropState } from "./crop/crop-state.js";

let sourceImage = null;

const HANDLE_SIZE = 14;

export function showCropPanel() {
    if (!requireImage()) return;

    logTool("Crop panel opened");

    openPanel(
    "Crop",
    "",
    window.applyCrop,
    window.cancelCrop
);
   
    sourceImage = new Image();

sourceImage.onload = () => {
    initCrop();
};
    sourceImage.onerror = () => {
    logTool("Crop image load failed");
    alert("Failed to load image");
};

const editor =
    getEditor();

if (
    editor.historyIndex < 0 ||
    !editor.history[
        editor.historyIndex
    ]
) {

    alert(
        "Upload image first"
    );

    return;
}

sourceImage.src =
    editor.history[
        editor.historyIndex
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



function startCrop(e) {
    logTool("Crop selection started");
    const { canvas } = getEditor();
    const pos = getCanvasPos(e);
    
    cropState.handle =
    getHandleAt(pos.x, pos.y);
    if (e.pointerId !== undefined) {
    canvas.setPointerCapture(e.pointerId);
    }

if (cropState.handle) {

    cropState.dragging = true;
    return;
}

    cropState.dragging = true;
    
    cropState.startX = pos.x;
cropState.startY = pos.y;

cropState.x = pos.x;
cropState.y = pos.y;

cropState.width = 0;
cropState.height = 0;
}

function drawCrop(e) {
    if (!sourceImage) return;
    if (!cropState.dragging) return;

    const { canvas, ctx } = getEditor();
    const pos = getCanvasPos(e);


if (cropState.handle === "tl") {

    cropState.startX = pos.x;
    cropState.startY = pos.y;

}
else if (cropState.handle === "tr") {

    cropState.width =
    pos.x - cropState.startX;
    cropState.startY = pos.y;

}
else if (cropState.handle === "bl") {

    cropState.startX = pos.x;
    cropState.height =
    pos.y - cropState.startY;

}
else if (cropState.handle === "br") {

    cropState.width =
    pos.x - cropState.startX;

cropState.height =
    pos.y - cropState.startY;

}
else {

    cropState.width =
    pos.x - cropState.startX;

cropState.height =
    pos.y - cropState.startY;

}
    


        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(sourceImage, 0, 0);

        // draw selection box
const x = cropState.width >= 0
    ? cropState.startX
    : cropState.startX + cropState.width;

const y = cropState.height >= 0
    ? cropState.startY
    : cropState.startY + cropState.height;

const w = Math.abs(cropState.width);

const h = Math.abs(cropState.height);

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

    cropState.dragging = false;

    if (e.pointerId !== undefined) {
        canvas.releasePointerCapture(e.pointerId);
    }
    cropState.handle = null;
}

window.applyCrop = () => {
    if (!sourceImage) return;
    const { ctx } = getEditor();

    const x = cropState.width >= 0
    ? cropState.startX
    : cropState.startX + cropState.width;

const y = cropState.height >= 0
    ? cropState.startY
    : cropState.startY + cropState.height;

const w = Math.abs(cropState.width);

const h = Math.abs(cropState.height);

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

    resizeCanvas(w, h);

getEditor().ctx.drawImage(temp, 0, 0);
    
    commitCanvas();
    logTool(`Crop applied ${Math.round(w)}x${Math.round(h)}`);
    resetCrop();
    cleanup();
};

window.cancelCrop = () => {

    restoreImage();
    logTool("Crop cancelled");

    resetCrop();

    cleanup();
};

window.closeCrop = () => {

    restoreImage();
    
    logTool("Crop closed");
    resetCrop();
    cleanup();
    
};

function cleanup() {
    cropState.dragging = false;
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
        cropState.startX === cropState.x + cropState.width &&
        cropState.startY === cropState.y + cropState.height
    ) {
        return null;
    }

    const left = cropState.width >= 0
    ? cropState.startX
    : cropState.startX + cropState.width;

const top = cropState.height >= 0
    ? cropState.startY
    : cropState.startY + cropState.height;

const width = Math.abs(cropState.width);

const height = Math.abs(cropState.height);
    const handles = {

const handles = {
    tl:[left,top],
    tr:[left+width,top],
    bl:[left,top+height],
    br:[left+width,top+height]
};


    for (const key in handles) {

        function getHandleAt(mouseX, mouseY)
        
        const dx = mouseX - hx;
        const dy = mouseY - hy;

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

    if (cropState.dragging) return;

    const { canvas } = getEditor();

    const pos = getCanvasPos(e);

    updateCursor(pos);
}

function resetCrop() {

    cropState.startX = 0;
    cropState.startY = 0;
    cropState.x = 0;
    cropState.y = 0;

    cropState.width = 0;
    cropState.height = 0;
    cropState.handle = null;
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
        0
    );
}
