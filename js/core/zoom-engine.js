import { state } from "./editor-state.js";

const MIN_ZOOM = 0.1;
const MAX_ZOOM = 10;

export function setZoom(value) {

    state.zoom = Math.max(
        MIN_ZOOM,
        Math.min(MAX_ZOOM, value)
    );

    return state.zoom;
}

export function zoomIn() {
    return setZoom(state.zoom + 0.1);
}

export function zoomOut() {
    return setZoom(state.zoom - 0.1);
}

export function resetZoom() {
    return setZoom(1);
}
