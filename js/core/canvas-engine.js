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

    const { canvas, ctx } =
        getEditor();

    if (!canvas || !ctx || !img) return;

    canvas.width = img.width;
    canvas.height = img.height;

    clearCanvas();

    ctx.drawImage(
        img,
        0,
        0
    );
}

export function resizeCanvas(
    width,
    height
) {

    const { canvas } =
        getEditor();

    canvas.width = width;
    canvas.height = height;
}

export function canvasToDataURL() {

    const { canvas } =
        getEditor();

    return canvas.toDataURL();
}
