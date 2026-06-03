import { state }
from "./editor-state.js";

export function saveHistory() {


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


    if (
        state.historyIndex <= 0
    ) {
        return;
    }

    state.historyIndex--;

    drawFromHistory();
}

export function redo() {



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


    const img = new Image();

    img.src =
        state.history[
            state.historyIndex
        ];

    img.onload = () => {

        drawImage(img);

    };
}
