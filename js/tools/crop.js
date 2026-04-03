// js/tools/crop.js
const canvas = document.getElementById('main-canvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });

export function showCropPanel() {
    const panel = document.getElementById('tool-panel');
    panel.innerHTML = `
        <div class="flex justify-between items-center mb-4">
            <div class="font-medium">Crop Tool</div>
            <button onclick="closeToolPanel()" class="text-2xl text-zinc-400">×</button>
        </div>
        <div class="grid grid-cols-3 gap-2 mb-6 text-sm">
            <button onclick="setCropRatio(1,1)" class="py-2.5 bg-zinc-800 hover:bg-zinc-700 rounded-xl">1:1 Square</button>
            <button onclick="setCropRatio(4,5)" class="py-2.5 bg-zinc-800 hover:bg-zinc-700 rounded-xl">4:5 Portrait</button>
            <button onclick="setCropRatio(16,9)" class="py-2.5 bg-zinc-800 hover:bg-zinc-700 rounded-xl">16:9 Landscape</button>
        </div>
        <div class="text-zinc-400 text-xs mb-4">
            Tap and drag on image to select area (basic version)
        </div>
        <button onclick="applyCrop()" class="w-full py-3 mb-3 bg-violet-600 hover:bg-violet-700 rounded-2xl text-sm font-medium">
            Apply Crop
        </button>
        <button onclick="resetCrop()" class="w-full py-3 text-sm font-medium bg-zinc-800 hover:bg-zinc-700 rounded-2xl">
            Cancel
        </button>
    `;

    initCropListeners();
}

let startX = 0, startY = 0, isCropping = false;

function initCropListeners() {
    canvas.addEventListener('pointerdown', startCrop);
    canvas.addEventListener('pointerup', endCrop);
}

function startCrop(e) {
    isCropping = true;
    const pos = getCanvasPos(e);
    startX = pos.x;
    startY = pos.y;
}

function endCrop(e) {
    if (!isCropping) return;
    isCropping = false;
    applyCrop(); // simple center crop for now
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

window.setCropRatio = (rx, ry) => {
    alert(`Ratio \( {rx}: \){ry} selected.\n\nVisual crop selection with ratio lock coming in next update.`);
};

window.applyCrop = () => {
    const newW = Math.floor(canvas.width * 0.82);
    const newH = Math.floor(canvas.height * 0.82);
    const temp = document.createElement('canvas');
    temp.width = newW; temp.height = newH;
    const tctx = temp.getContext('2d');
    tctx.drawImage(canvas, 
        (canvas.width - newW)/2, (canvas.height - newH)/2, 
        newW, newH, 
        0, 0, newW, newH);

    canvas.width = newW;
    canvas.height = newH;
    ctx.drawImage(temp, 0, 0);
    window.saveHistory();
};

window.resetCrop = () => {
    window.undo();
    closeToolPanel();
};

export { showCropPanel };
