// js/tools/crop.js
const canvas = document.getElementById('main-canvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });

let isCropping = false;
let startX, startY, cropWidth, cropHeight;

export function showCropPanel() {
    const panel = document.getElementById('tool-panel');
    panel.innerHTML = `
        <div class="flex justify-between items-center mb-4">
            <div class="font-medium">Crop</div>
            <button onclick="closeToolPanel()" class="text-2xl text-zinc-400">×</button>
        </div>
        <div class="grid grid-cols-3 gap-2 mb-6">
            <button onclick="setCropRatio(1,1)" class="py-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-sm">1:1</button>
            <button onclick="setCropRatio(4,5)" class="py-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-sm">4:5</button>
            <button onclick="setCropRatio(16,9)" class="py-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-sm">16:9</button>
        </div>
        <button onclick="applyCrop()" 
                class="w-full py-3 mb-3 bg-violet-600 hover:bg-violet-700 rounded-2xl text-sm font-medium">
            Apply Crop
        </button>
        <button onclick="resetCrop()" 
                class="w-full py-3 text-sm font-medium bg-zinc-800 hover:bg-zinc-700 rounded-2xl">
            Cancel / Reset
        </button>
    `;

    // Basic crop instructions
    alert("👆 Tap and drag on the image to select crop area.\n\nCrop tool is basic in this version.");
    
    initCropListeners();
}

function initCropListeners() {
    canvas.addEventListener('pointerdown', startCrop);
    canvas.addEventListener('pointermove', duringCrop);
    canvas.addEventListener('pointerup', endCrop);
}

function startCrop(e) {
    isCropping = true;
    const pos = getCanvasPos(e);
    startX = pos.x;
    startY = pos.y;
}

function duringCrop(e) {
    if (!isCropping) return;
    // Visual feedback can be added later with overlay
}

function endCrop(e) {
    if (!isCropping) return;
    isCropping = false;
    const pos = getCanvasPos(e);
    cropWidth = Math.abs(pos.x - startX);
    cropHeight = Math.abs(pos.y - startY);
    // For simplicity, we apply immediately in this version
    applyCrop();
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

window.setCropRatio = (ratioX, ratioY) => {
    alert(`Crop ratio set to \( {ratioX}: \){ratioY}\n\nFull drag-to-crop with ratio lock coming soon.`);
};

window.applyCrop = () => {
    // Simple center crop for demo (real implementation needs selection rect)
    const newWidth = Math.floor(canvas.width * 0.8);
    const newHeight = Math.floor(canvas.height * 0.8);
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = newWidth;
    tempCanvas.height = newHeight;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(canvas, (canvas.width - newWidth)/2, (canvas.height - newHeight)/2, newWidth, newHeight, 0, 0, newWidth, newHeight);
    
    canvas.width = newWidth;
    canvas.height = newHeight;
    ctx.drawImage(tempCanvas, 0, 0);
    window.saveHistory();
};

window.resetCrop = () => {
    // Reload last history state or original
    window.undo(); // simple fallback
    closeToolPanel();
};

export { showCropPanel };
