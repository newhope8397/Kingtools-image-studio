import { getEditor } from '../editor-core.js';
import { commitCanvas } from "../core/canvas-engine.js";
import { saveHistory } from "../core/history-engine.js";
import { requireImage } from "../core/guard-engine.js";
import { openPanel } from "../core/panel-engine.js";

export function showFiltersPanel() {
    const panel = document.getElementById('tool-panel');
    if (!requireImage()) return;
    openPanel(
    "Filters",
`
<button onclick="applyFilter('grayscale')">
Grayscale
</button>

<button onclick="applyFilter('sepia')">
Sepia
</button>
`
);
}

window.applyFilter = (type) => {
    const { canvas, ctx } = getEditor();

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        let r = data[i], g = data[i+1], b = data[i+2];

    const filters = {
    grayscale,
    sepia,
    vivid
};

        {
            const gray = (r + g + b) / 3;
            r = g = b = gray;
        }

     {
        const or = r;
        const og = g;
        const ob = b;

r = or * 0.393 + og * 0.769 + ob * 0.189;
g = or * 0.349 + og * 0.686 + ob * 0.168;
b = or * 0.272 + og * 0.534 + ob * 0.131;
        }

        {
            r *= 1.2; g *= 1.2; b *= 1.2;
        }

        data[i] = Math.min(255, r);
        data[i+1] = Math.min(255, g);
        data[i+2] = Math.min(255, b);
    }

    ctx.putImageData(imageData, 0, 0);
    commitCanvas();

    saveHistory();
};

window.showFiltersPanel = showFiltersPanel;
