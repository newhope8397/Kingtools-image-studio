// core/zoom-engine.js

import { state } from "./editor-state.js";

export function setZoom(value) {

    state.zoom = Math.max(
    0.1,
    Math.min(10, value)
);
}

export function zoomIn() {

    state.zoom += 0.1;

    return state.zoom;
}

export function zoomOut() {

    state.zoom = Math.max(
        0.1,
        state.zoom - 0.1
    );

    return state.zoom;
}

export function resetZoom() {

    state.zoom = 1;

    return state.zoom;
}
