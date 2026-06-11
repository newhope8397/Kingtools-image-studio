// core/brush-engine.js //


import { state } from "./editor-state.js";

let brushSize = 20;

export function setBrushSize(size) {

    brushSize = size;
}

export function getBrushSize() {

    return brushSize;
}

export function drawBrush(
    x,
    y
) {

    if (!state.ctx) return;

    state.ctx.beginPath();

    state.ctx.arc(
        x,
        y,
        brushSize / 2,
        0,
        Math.PI * 2
    );

    state.ctx.fill();
}
