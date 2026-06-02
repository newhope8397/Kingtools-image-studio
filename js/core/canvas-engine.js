// js/core/canvas-engine.js

import { getEditor } from "../editor-core.js";

export function clearCanvas() {

    const { canvas, ctx } =
        getEditor();
    
    if (!canvas || !ctx) return;

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );
}

export function drawImage(img) {

    const { canvas, ctx } =
        getEditor();

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
