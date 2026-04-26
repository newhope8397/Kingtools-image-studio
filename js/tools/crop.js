// js/tools/crop.js

import { getEditor } from '../editor-core.js';

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

    isCropping = true;
    const pos = getPos(e, canvas);

    startX = pos.x;
    startY = pos.y;
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
        ctx.strokeStyle = "#a78bfa";
        ctx.lineWidth = 2;
        ctx.setLineDash([6]);

        ctx.strokeRect(
            startX,
            startY,
            endX - startX,
            endY - startY
        );
    };
}

function endCrop() {
    isCropping = false;
}

window.applyCrop = () => {
    const { canvas, ctx, saveHistory } = getEditor();

    const x = Math.min(startX, endX);
    const y = Math.min(startY, endY);
    const w = Math.abs(endX - startX);
    const h = Math.abs(endY - startY);

    if (w < 10 || h < 10) return;

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
