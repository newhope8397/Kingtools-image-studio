// js/core/canvas-engine.js
import { state } from "./editor-state.js";
import { saveHistory } from "./history-engine.js";          
export function clearCanvas() {

    if (
        !state.canvas ||
        !state.ctx
    ) return;

    state.ctx.clearRect(
        0,
        0,
        state.canvas.width,
        state.canvas.height
    );
}

export function drawImage(img) {

    if (
        !state.canvas ||
        !state.ctx ||
        !img
    ) return;

    state.canvas.width =
        img.width;

    state.canvas.height =
        img.height;

    clearCanvas();

    state.ctx.drawImage(
        img,
        0,
        0
    );
}

export function resizeCanvas(
    width,
    height
) {

    if (!state.canvas) return;

    state.canvas.width =
        width;

    state.canvas.height =
        height;
}

export function canvasToDataURL() {

    if (!state.canvas)
        return null;

    return state.canvas.toDataURL();
}

export function syncStateImage() {
    
    if (!state.canvas)
        return;

    const img = new Image();

    img.onload = () => {
        state.image = img;
    };

    img.src = state.canvas.toDataURL();
}

export function markDirty() {
    state.isDirty = true;
}

export function clearDirty() {
    state.isDirty = false;
}

export function commitCanvas() {

    syncStateImage();

    saveHistory();
    clearDirty();
}
