// js/core/selection-engine.js

let selection = null;

export function createSelection(
    x,
    y,
    w,
    h
) {

    selection = {
        x,
        y,
        w,
        h
    };
}

export function getSelection() {
    return selection;
}

export function clearSelection() {
    selection = null;
}

export function hasSelection() {
    return selection !== null;
}
