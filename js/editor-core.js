// js/editor-core.js
let canvas, ctx;
let currentImage = null;
let historyStack = [];
let historyIndex = -1;

// Global saveHistory - safe for all tools
window.saveHistory = function() {
    if (!canvas) return;
    if (historyStack.length >= 20) {
        historyStack.shift();
        if (historyIndex > 0) historyIndex--;
    }
    historyStack = historyStack.slice(0, historyIndex + 1);
    historyStack.push(canvas.toDataURL('image/png'));
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

// ==================== SIMPLE & RELIABLE TOOL SWITCHER ====================
export function switchTool(n) {
    // Highlight active button
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    const activeBtn = document.getElementById(`nav-${n}`);
    if (activeBtn) activeBtn.classList.add('active');

    // Show panel
    const panel = document.getElementById('tool-panel');
    panel.classList.remove('hidden');

    // Call the correct tool (all tools now expose to window)
    const toolMap = {
        0: window.showMagicPanel,
        1: window.showFiltersPanel,
        2: window.showEffectsPanel,
        3: window.showEraserPanel,
        4: window.showCropPanel,
        5: window.showAdjustPanel
    };

    if (toolMap[n]) {
        toolMap[n]();
    } else {
        alert("Tool coming soon!");
    }
}

window.closeToolPanel = () => {
    const panel = document.getElementById('tool-panel');
    panel.classList.add('hidden');
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
};

export { switchTool };
