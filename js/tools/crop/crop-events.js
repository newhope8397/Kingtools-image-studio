//////// js/tools/crop/crop-events.js //////

import { cropState } from "./crop-state.js";
import { getEditor } from "../../editor-core.js";
import { getCanvasPos } from "../../core/event-engine.js";
import { getHandleAt } from "./crop-handles.js";
import { renderCropOverlay } from "./crop-overlay.js";

export function startCrop(e) {

    const { canvas } = getEditor();
    const pos = getCanvasPos(e);

    cropState.handle = getHandleAt(pos.x, pos.y);

    if (e.pointerId != null) {
        canvas.setPointerCapture(e.pointerId);
    }

    cropState.dragging = true;

    if (cropState.handle) {
        cropState.resizing = true;
        return;
    }

    cropState.resizing = false;

    cropState.startX = pos.x;
    cropState.startY = pos.y;

    cropState.x = pos.x;
    cropState.y = pos.y;

    cropState.width = 0;
    cropState.height = 0;
}

export function drawCrop(e) {

    if (!cropState.dragging) return;

    const pos = getCanvasPos(e);

    cropState.width = pos.x - cropState.startX;
    cropState.height = pos.y - cropState.startY;

    renderCropOverlay();
}

export function endCrop(e) {

    const { canvas } = getEditor();

    cropState.dragging = false;
    cropState.resizing = false;
    cropState.handle = null;

    if (e.pointerId != null) {
        canvas.releasePointerCapture(e.pointerId);
    }
}

export function hoverCrop(e) {

    // Cursor logic will be added after handles are upgraded.
}
