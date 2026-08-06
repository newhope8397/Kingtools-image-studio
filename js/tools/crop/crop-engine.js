// js/tools/crop/crop-engine.js

import { getEditor } from "../../editor-core.js";
import { cropState } from "./crop-state.js";
import {
    commitCanvas,
    resizeCanvas
} from "../../core/canvas-engine.js";

let sourceImage = null;

export function setCropImage(img) {
    sourceImage = img;
}

export function getCropImage() {
    return sourceImage;
}

export function clearCropImage() {
    sourceImage = null;
}

export function applyCrop() {

    if (!sourceImage) return;

    const x =
        cropState.width >= 0
        ? cropState.startX
        : cropState.startX + cropState.width;

    const y =
        cropState.height >= 0
        ? cropState.startY
        : cropState.startY + cropState.height;

    const w = Math.abs(cropState.width);
    const h = Math.abs(cropState.height);

    if (w < 30 || h < 30) {
        alert("Crop area too small");
        return;
    }

    const temp =
        document.createElement("canvas");

    temp.width = w;
    temp.height = h;

    const tctx =
        temp.getContext("2d");

    tctx.drawImage(
        sourceImage,
        x,
        y,
        w,
        h,
        0,
        0,
        w,
        h
    );

    resizeCanvas(w, h);

    const { ctx } = getEditor();

    ctx.clearRect(0,0,w,h);

    ctx.drawImage(temp,0,0);

    commitCanvas();
}

export function restoreImage() {

    if (!sourceImage) return;

    const {
        canvas,
        ctx
    } = getEditor();

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.drawImage(
        sourceImage,
        0,
        0
    );
}

export function resetCrop() {

    cropState.active = false;
    cropState.dragging = false;
    cropState.resizing = false;
    cropState.moveMode = false;

    cropState.handle = null;

    cropState.x = 0;
    cropState.y = 0;

    cropState.width = 0;
    cropState.height = 0;

    cropState.startX = 0;
    cropState.startY = 0;
}

export function cancelCrop() {

    restoreImage();

    resetCrop();
}
