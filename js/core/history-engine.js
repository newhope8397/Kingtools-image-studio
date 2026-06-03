import { state }
from "./editor-state.js";

import {
    drawImage
} from "./canvas-engine.js";

export function saveHistory() {

    const {
        canvas,
        state
    } = getEditor();

    if (!canvas) return;

    state.history =
        state.history.slice(
            0,
            state.historyIndex + 1
        );

    state.history.push(
        canvas.toDataURL()
    );

    state.historyIndex++;

    if (
        state.history.length > 20
    ) {

        state.history.shift();

        state.historyIndex--;
    }
}

export function undo() {

    const { state } =
        getEditor();

    if (
        state.historyIndex <= 0
    ) {
        return;
    }

    state.historyIndex--;

    drawFromHistory();
}

export function redo() {

    const { state } =
        getEditor();

    if (
        state.historyIndex >=
        state.history.length - 1
    ) {
        return;
    }

    state.historyIndex++;

    drawFromHistory();
}

export function drawFromHistory() {

    const { state } =
        getEditor();

    const img = new Image();

    img.src =
        state.history[
            state.historyIndex
        ];

    img.onload = () => {

        drawImage(img);

    };
}
