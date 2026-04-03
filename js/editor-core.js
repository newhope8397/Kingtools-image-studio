// js/editor-core.js
let canvas, ctx;
let currentImage = null;
let historyStack = [];
let historyIndex = -1;

// Global saveHistory - safe for all tools
window.saveHistory = function() {
    if (!canvas) return;
    
    // Cap history at 20 entries for mobile memory safety
    if (historyStack.length >= 20) {
        historyStack.shift();
        if (historyIndex > 0) historyIndex--;
    }
    
    historyStack = historyStack.slice(0, historyIndex + 1);
    historyStack.push(canvas.toDataURL('image/png')); // lossless for editing
    historyIndex = historyStack.length - 1;
};

export function initEditor() {
    canvas = document.getElementById('main-canvas');
    ctx = canvas.getContext('2d', { willReadFrequently: true });
}

export function loadSampleImage() {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = "https://picsum.photos/id/1015/800/800";
    img.onload = () => {
        currentImage = img;
        resetCanvasToImage();
        window.saveHistory();
    };
}

function resetCanvasToImage() {
    if (!currentImage) return;
    canvas.width = currentImage.width;
    canvas.height = currentImage.height;
    ctx.drawImage(currentImage, 0, 0);
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
            window.saveHistory();
        };
        img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
}

export function undo() {
    if (historyIndex <= 0) return;
    historyIndex--;
    loadFromHistory();
}

export function redo() {
    if (historyIndex >= historyStack.length - 1) return;
    historyIndex++;
    loadFromHistory();
}

function loadFromHistory() {
    if (!historyStack[historyIndex]) return;
    const img = new Image();
    img.src = historyStack[historyIndex];
    img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.onerror = () => console.warn('Failed to load history state');
}

export function downloadImage() {
    const a = document.createElement('a');
    a.download = `kingtools-edit-${new Date().toISOString().slice(0,10)}.png`;
    a.href = canvas.toDataURL('image/png');
    a.click();
}

export function finishEditing() {
    alert("✅ Editing complete!\n\nYour image is ready.\nDon't forget to download your work!");
}

// Tool Management
export async function switchTool(n) {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(`nav-${n}`).classList.add('active');

    const panel = document.getElementById('tool-panel');
    panel.classList.remove('hidden');

    cleanupCurrentTool();

    switch (n) {
        case 0:
            await showMagicPanel();
            break;
        case 1:
            await import('./tools/filters.js').then(m => m.showFiltersPanel?.());
            break;
        case 2:
            await import('./tools/effects.js').then(m => m.showEffectsPanel?.());
            break;
        case 3:
            await import('./tools/eraser.js').then(m => m.showEraserPanel());
            break;
        case 4:
            await import('./tools/crop.js').then(m => m.showCropPanel?.());
            break;
        case 5:
            await import('./tools/adjust.js').then(m => m.showAdjustPanel?.());
            break;
    }
}

function cleanupCurrentTool() {
    const canvasEl = document.getElementById('main-canvas');
    if (canvasEl) canvasEl.style.cursor = 'default';
}

function showMagicPanel() {
    const panel = document.getElementById('tool-panel');
    panel.innerHTML = `
        <div class="flex justify-between items-center mb-4">
            <div class="font-medium">Magic Studio</div>
            <button onclick="closeToolPanel()" class="text-2xl text-zinc-400">×</button>
        </div>
        <div class="grid grid-cols-2 gap-3">
            <div onclick="magicAction('Magic Edit')" class="bg-zinc-800 hover:bg-zinc-700 p-6 rounded-3xl text-center cursor-pointer transition">🪄 Magic Edit</div>
            <div onclick="magicAction('Magic Expand')" class="bg-zinc-800 hover:bg-zinc-700 p-6 rounded-3xl text-center cursor-pointer transition">📏 Magic Expand</div>
            <div onclick="magicAction('Remove Object')" class="bg-zinc-800 hover:bg-zinc-700 p-6 rounded-3xl text-center cursor-pointer transition">🗑️ Remove Object</div>
            <div onclick="magicAction('Change Background')" class="bg-zinc-800 hover:bg-zinc-700 p-6 rounded-3xl text-center cursor-pointer transition">🌄 New Background</div>
        </div>
    `;
}

window.magicAction = (action) => {
    alert(`🔮 ${action} activated!\n\nFull AI features coming soon.`);
    window.saveHistory();
};

window.closeToolPanel = () => {
    const panel = document.getElementById('tool-panel');
    panel.classList.add('hidden');
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
};

export { switchTool };
