// js/tools/crop/crop-overlay.js //
import { getEditor } from "../../editor-core.js";
import { cropState } from "./crop-state.js";
import { drawHandles } from "./crop-handles.js";

let sourceImage = null;

export function setCropImage(image) {

    sourceImage = image;

}

export function renderCropOverlay() {

    if (!sourceImage) return;

    const { canvas, ctx } = getEditor();

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

    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.clearRect(
        x,
        y,
        w,
        h
    );

    ctx.drawImage(
        sourceImage,
        x,
        y,
        w,
        h,
        x,
        y,
        w,
        h
    );

    ctx.strokeStyle = "#a78bfa";
    ctx.lineWidth = 2;

    ctx.setLineDash([6]);

    ctx.strokeRect(
        x,
        y,
        w,
        h
    );

    ctx.setLineDash([]);

    for (let i = 1; i < 3; i++) {

        ctx.beginPath();
        ctx.moveTo(
            x + (w / 3) * i,
            y
        );
        ctx.lineTo(
            x + (w / 3) * i,
            y + h
        );
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(
            x,
            y + (h / 3) * i
        );
        ctx.lineTo(
            x + w,
            y + (h / 3) * i
        );
        ctx.stroke();

    }

    drawHandles(
        x,
        y,
        w,
        h
    );

          }
