import { getEditor, saveHistory } from '../editor-core.js';
import { saveHistory }
from "../core/history-engine.js";

let isErasing = false;

export function showEraserPanel() {
    const panel = document.getElementById('tool-panel');
    panel.innerHTML = `<div>Drag on image to erase</div>`;

    const { canvas, ctx } = getEditor();

    canvas.onpointerdown = () => isErasing = true;
    canvas.onpointerup = () => {
        isErasing = false;
        saveHistory();
    };

    canvas.onpointermove = (e) => {
        if (!isErasing) return;

        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (canvas.width / rect.width);
        const y = (e.clientY - rect.top) * (canvas.height / rect.height);

        ctx.clearRect(x - 10, y - 10, 20, 20);
    };
}

window.showEraserPanel = showEraserPanel;
