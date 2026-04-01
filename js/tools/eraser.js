// js/tools/eraser.js
let isErasing = false;
let lastX = 0, lastY = 0;
let eraserSize = 35;
let eraseMode = 'erase'; // 'erase' or 'restore'

const canvas = document.getElementById('main-canvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });

export function showEraserPanel() {
    const panel = document.getElementById('tool-panel');
    panel.innerHTML = `
        <div class="flex justify-between items-center mb-4">
            <div class="font-medium">Pixel Eraser</div>
            <button onclick="closeToolPanel()" class="text-2xl text-zinc-400">×</button>
        </div>
        <div class="flex gap-2 mb-4">
            <button onclick="toggleEraseMode('erase')" id="erase-btn"
                class="flex-1 py-2.5 rounded-xl text-sm font-medium ${eraseMode==='erase'?'bg-violet-600':'bg-zinc-700'}">Erase</button>
            <button onclick="toggleEraseMode('restore')" id="restore-btn"
                class="flex-1 py-2.5 rounded-xl text-sm font-medium ${eraseMode==='restore'?'bg-violet-600':'bg-zinc-700'}">Restore</button>
        </div>
        <div>
            <div class="flex justify-between text-sm mb-1">
                <span>Brush Size</span>
                <span id="size-val">${eraserSize}</span>
            </div>
            <input type="range" min="8" max="120" value="${eraserSize}" 
                   oninput="setEraserSize(this.value)" class="w-full accent-violet-500">
        </div>
    `;

    initEraserListeners();
}

function initEraserListeners() {
    canvas.addEventListener('pointerdown', startErase);
    canvas.addEventListener('pointermove', doErase);
    canvas.addEventListener('pointerup', stopErase);
    canvas.addEventListener('pointerleave', stopErase);
}

window.setEraserSize = (size) => {
    eraserSize = parseInt(size);
    document.getElementById('size-val').textContent = eraserSize;
};

window.toggleEraseMode = (mode) => {
    eraseMode = mode;
    showEraserPanel(); // Refresh buttons
};

function startErase(e) {
    isErasing = true;
    const pos = getCanvasPos(e);
    lastX = pos.x;
    lastY = pos.y;
    doErase(e);
}

function stopErase() {
    if (isErasing) {
        window.saveHistory(); // from editor-core
    }
    isErasing = false;
}

function doErase(e) {
    if (!isErasing) return;

    const pos = getCanvasPos(e);
    ctx.save();

    ctx.globalCompositeOperation = eraseMode === 'erase' ? 'destination-out' : 'source-over';
    ctx.lineWidth = eraserSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = eraseMode === 'erase' ? '#000' : '#fff'; // only for restore visual

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
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
    };
}

export { showEraserPanel };
