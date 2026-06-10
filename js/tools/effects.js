import { getEditor } from '../editor-core.js';
import { saveHistory }
from "../core/history-engine.js";
import { requireImage } from "../core/guard-engine.js";

export function showEffectsPanel() {
    
    const panel = document.getElementById('tool-panel');
    if (!requireImage()) return;
    panel.innerHTML = `
        <div class="mb-4 font-medium">Effects</div>
        <button onclick="applyEffect('blur')">Blur</button>
        <button onclick="applyEffect('glow')">Glow</button>
    `;
}

window.applyEffect = (type) => {
    const { canvas, ctx } = getEditor();

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        if (type === 'blur') {
            data[i] *= 0.9;
            data[i+1] *= 0.9;
            data[i+2] *= 0.9;
        }

        if (type === 'glow') {
            data[i] *= 1.2;
            data[i+1] *= 1.2;
            data[i+2] *= 1.2;
        }
    }

    ctx.putImageData(imageData, 0, 0);
    saveHistory();
};

window.showEffectsPanel = showEffectsPanel;
