// js/core/canvas-engine.js
import { state } from "./editor-state.js";

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
