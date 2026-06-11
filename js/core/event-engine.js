//core/event-engine.js//

import { state }
from "./editor-state.js";

export function getCanvasPos(e) {

    const canvas =
        state.canvas;

    if (!canvas)
        return null;

    const rect =
        canvas.getBoundingClientRect();

    return {

        x:
        (e.clientX - rect.left) *
        (canvas.width / rect.width),

        y:
        (e.clientY - rect.top) *
        (canvas.height / rect.height)
    };
}

export function updatePointer(e) {

    const pos =
        getCanvasPos(e);

    if (!pos) return;

    state.mouseX = pos.x;
    state.mouseY = pos.y;
}
