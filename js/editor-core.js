// js/editor-core.js
let canvas, ctx;
let currentImage = null;
let originalData = null;
let historyStack = [];
let historyIndex = -1;

let currentTool = null;

export function initEditor() {
    canvas = document.getElementById('main-canvas');
    ctx = canvas.getContext('2d', { willReadFrequently: true });

    // Make canvas responsive
    window.addEventListener('resize', resizeCanvas);
}

function resizeCanvas() {
    if (!currentImage) return;
    // We keep original dimensions for editing, only display scales
}

export function loadSampleImage() {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = "https://picsum.photos/id/1015/800/800";
    img.onload = () => {
        currentImage = img;
        resetCanvasToImage();
        saveHistory();
    };
}

function resetCanvasToImage() {
    canvas.width = currentImage.width;
    canvas.height = currentImage.height;
    ctx.drawImage(currentImage, 0, 0);
    originalData = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

export function triggerUpload() {
    document.getElementById('image-upload').click();
}

export function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
        const img = new Image();
        img.onload = () => {
            currentImage = img;
            resetCanvasToImage();
            saveHistory();
        };
        img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
}

export function saveHistory() {
    historyStack = historyStack.slice(0, historyIndex + 1);
    historyStack.push(canvas.toDataURL('image/png'));
    historyIndex = historyStack.length - 1;
}

export function undo() {
    if (historyIndex <= 0) return;
    historyIndex--;
    const img = new Image();
    img.src = historyStack[historyIndex];
    img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
}

export function redo() {
    if (historyIndex >= historyStack.length - 1) return;
    historyIndex++;
    const img = new Image();
    img.src = historyStack[historyIndex];
    img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
}

export function downloadImage() {
    const a = document.createElement('a');
    a.download = 'kingtools-edit.png';
    a.href = canvas.toDataURL('image/png');
    a.click();
}

export function finishEditing() {
    alert("✅ Editing complete!\nYour image is ready.");
}

// Tool Management
export async function switchTool(n) {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('nav-' + n).classList.add('active');

    const panel = document.getElementById('tool-panel');
    panel.classList.remove('hidden');

    // Clean up previous tool listeners
    cleanupCurrentTool();

    if (n === 0) await showMagicPanel();
    else if (n === 1) await import('./tools/filters.js').then(m => m.showFiltersPanel());
    else if (n === 2) await import('./tools/effects.js').then(m => m.showEffectsPanel?.() || showBasicEffectsPanel());
    else if (n === 3) await import('./tools/eraser.js').then(m => m.showEraserPanel());
    else if (n === 4) await import('./tools/crop.js').then(m => m.showCropPanel());
    else if (n === 5) await import('./tools/adjust.js').then(m => m.showAdjustPanel());
}

function cleanupCurrentTool() {
    canvas.style.cursor = 'default';
    // Add more cleanup if needed
}

function showMagicPanel() {
    const panel = document.getElementById('tool-panel');
    panel.innerHTML = `
        <div class="flex justify-between items-center mb-4">
            <div class="font-medium">Magic Studio</div>
            <button onclick="closeToolPanel()" class="text-2xl text-zinc-400">×</button>
        </div>
        <div class="grid grid-cols-2 gap-3">
            <div onclick="magicAction('Magic Edit')" class="bg-zinc-800 p-4 rounded-3xl text-center cursor-pointer hover:bg-zinc-700">🪄 Magic Edit</div>
            <div onclick="magicAction('Magic Expand')" class="bg-zinc-800 p-4 rounded-3xl text-center cursor-pointer hover:bg-zinc-700">📏 Magic Expand</div>
            <!-- Add more -->
        </div>
    `;
}

window.magicAction = (action) => {
    alert(`🔮 ${action} activated!\n\nFull AI integration coming soon.`);
    saveHistory();
};

window.closeToolPanel = () => {
    document.getElementById('tool-panel').classList.add('hidden');
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
};
