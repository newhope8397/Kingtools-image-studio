// js/editor-core.js
import { state }from "./core/editor-state.js";
import { triggerUpload, getSelectedFile } from "./core/file-engine.js";
import { drawImage } from "./core/canvas-engine.js";
import { saveHistory,undo,redo } from "./core/history-engine.js";
import { deactivateTool }from "./core/tool-engine.js";


// 🔥 SINGLE SOURCE OF TRUTH
export function getEditor() {
    return state;
}
export function initEditor() {

    state.canvas =
        document.getElementById(
            "main-canvas"
        );

    state.ctx =
        state.canvas.getContext(
            "2d",
            {
                willReadFrequently: true
            }
        );
}

// ================= UPLOAD =================

export function handleImageUpload(e) {
    const file = getSelectedFile(e);

if (!file) {
    return;
}

alert(
`${file.name}
${file.type}
${Math.round(file.size / 1024 / 1024)} MB`
);

    
    const reader = new FileReader();

    reader.onload = (ev) => {
        const img = new Image();

        img.onload = () => {
            loadImage(img); // 🔥 use core system
        };

        img.src = ev.target.result;
    };

    reader.readAsDataURL(file);
}
// ================= IMAGE LOAD =================
export function loadImage(img) {

    state.image = img;

    drawImage(img);

    saveHistory();
}
export function setToolBar(
    title,
    leftAction,
    rightAction
) {

    const panel =
        document.getElementById(
            "tool-panel"
        );

    panel.innerHTML = `
        <div class="flex items-center justify-between px-4 py-3">

            <button onclick="${leftAction}">
                ✖
            </button>

            <span>${title}</span>

            <button onclick="${rightAction}">
                ✔
            </button>

        </div>
    `;

    panel.classList.add("active");
}

// ================= HISTORY =================


// ================= DOWNLOAD =================
export function downloadImage() {

    if (!state.canvas) return;

    const a =
        document.createElement("a");

    a.download =
        "kingtools.png";

    a.href =
        state.canvas.toDataURL();

    a.click();
}
// ================= UI FUNCTIONS =================

export function finishEditing() {
    alert("✅ Editing complete!");
}

export async function switchTool(n) {

    deactivateTool();
    
    const panel = document.getElementById("tool-panel");
    if (!panel) return;

    // 🔥 Always show panel (slide up)
    panel.classList.add("active");

    // highlight active button
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById(`nav-${n}`);
    if (activeBtn) activeBtn.classList.add('active');

    try {
        switch (n) {
            case 0:
                panel.innerHTML = `<div style="padding:20px">✨ Magic tools coming soon</div>`;
                break;

            case 1:
                (await import('./tools/filters.js')).showFiltersPanel();
                break;

            case 2:
                (await import('./tools/effects.js')).showEffectsPanel();
                break;

            case 3:
                (await import('./tools/eraser.js')).showEraserPanel();
                break;

            case 4:
                (await import('./tools/crop.js')).showCropPanel();
                break;

            case 5:
                (await import('./tools/adjust.js')).showAdjustPanel();
                break;
        }
    } catch (err) {
        console.error(err);
        panel.innerHTML = `<div style="padding:20px">⚠️ Tool failed to load</div>`;
    }
}
export function logTool(msg) {

    const time =
        new Date().toLocaleTimeString();

    console.log(
        `[KingTools ${time}] ${msg}`
    );
}

export {
    triggerUpload,
    undo,
    redo
};
window.downloadImage = downloadImage;
window.undo = undo;
window.redo = redo;
window.triggerUpload = triggerUpload;
window.handleImageUpload = handleImageUpload;
window.finishEditing = finishEditing;
window.switchTool = switchTool;
