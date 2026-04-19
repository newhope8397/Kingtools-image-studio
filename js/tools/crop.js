import { getEditor, saveHistory } from '../editor-core.js';

let isCropping = false;
let startX = 0, startY = 0;
let currentX = 0, currentY = 0;

export function showCropPanel() {
    const panel = document.getElementById('tool-panel');

    panel.innerHTML = `
        <div class="flex justify-between mb-4">
            <span>Crop</span>
            <button onclick="closeToolPanel()">×</button>
        </div>

        <button onclick="applyCrop()" class="w-full bg-violet-600 py-3 rounded-xl">
            Apply Crop
        </button>
    `;

    initCrop();
}

function initCrop() {
    const { canvas } = getEditor();

    canvas.addEventListener('pointerdown', startCrop);
    canvas.addEventListener('pointermove', drawCrop);
    canvas.addEventListener('pointerup', endCrop);
}

function startCrop(e) {
    const pos = getPos(e);

    isCropping = true;
    startX = pos.x;
    startY = pos.y;
}

function drawCrop(e) {
    if (!isCropping) return;

    const { ctx, canvas } = getEditor();
    const pos = getPos(e);

    currentX = pos.x;
    currentY = pos.y;

    redrawCanvas();

    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.setLineDash([6]);

    ctx.strokeRect(
        startX,
        startY,
        currentX - startX,
        currentY - startY
    );
}

function endCrop() {
    isCropping = false;
}

function redrawCanvas() {
    const { ctx, state } = getEditor();

    const img = new Image();
    img.src = state.history[state.historyIndex];

    img.onload = () => {
        ctx.clearRect(0,0,img.width,img.height);
        ctx.drawImage(img,0,0);
    };
}

window.applyCrop = function () {
    const { canvas, ctx } = getEditor();

    let x = Math.min(startX, currentX);
    let y = Math.min(startY, currentY);
    let w = Math.abs(currentX - startX);
    let h = Math.abs(currentY - startY);

    if (w < 5 || h < 5) return;

    const imageData = ctx.getImageData(x, y, w, h);

    canvas.width = w;
    canvas.height = h;

    ctx.putImageData(imageData, 0, 0);

    saveHistory();
};
