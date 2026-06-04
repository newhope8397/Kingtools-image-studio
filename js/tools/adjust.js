import { getEditor, saveHistory } from '../editor-core.js';

export function showAdjustPanel() {
    const panel = document.getElementById('tool-panel');

    panel.innerHTML = `
        <div>Brightness</div>
        <input type="range" min="50" max="150" value="100" oninput="adjustBrightness(this.value)">
    `;
}

window.adjustBrightness = (value) => {
    const { canvas, ctx } = getEditor();

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const factor = value / 100;

    for (let i = 0; i < data.length; i += 4) {
        data[i] *= factor;
        data[i+1] *= factor;
        data[i+2] *= factor;
    }
    window.applyBrightness = () => {
   saveHistory();
    }

    ctx.putImageData(imageData, 0, 0);
};

window.showAdjustPanel = showAdjustPanel;
