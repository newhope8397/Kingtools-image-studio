// js/editor-core.js

let canvas, ctx;

let state = {
    image: null,
    history: [],
    historyIndex: -1
};

// 🔥 SINGLE SOURCE OF TRUTH
export function getEditor() {
    return { canvas, ctx, state };
}

export function initEditor() {
    canvas = document.getElementById('main-canvas');
    ctx = canvas.getContext('2d', { willReadFrequently: true });
}

// ================= IMAGE LOAD =================
export function loadImage(img) {
    state.image = img;

    canvas.width = img.width;
    canvas.height = img.height;

    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.drawImage(img,0,0);

    saveHistory();
}

// ================= HISTORY =================
export function saveHistory() {
    if (!canvas) return;

    state.history = state.history.slice(0, state.historyIndex + 1);

    state.history.push(canvas.toDataURL());
    state.historyIndex++;

    if (state.history.length > 20) {
        state.history.shift();
        state.historyIndex--;
    }
}

export function undo() {
    if (state.historyIndex <= 0) return;

    state.historyIndex--;
    drawFromHistory();
}

export function redo() {
    if (state.historyIndex >= state.history.length - 1) return;

    state.historyIndex++;
    drawFromHistory();
}

function drawFromHistory() {
    const img = new Image();
    img.src = state.history[state.historyIndex];

    img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
    };
}

// ================= DOWNLOAD =================
export function downloadImage() {
    const a = document.createElement("a");
    a.download = "kingtools.png";
    a.href = canvas.toDataURL();
    a.click();
}
