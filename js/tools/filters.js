import { getEditor, saveHistory } from '../editor-core.js';

export function showFiltersPanel() {
    const panel = document.getElementById('tool-panel');
    panel.innerHTML = `
        <div class="mb-4 font-medium">Filters</div>
        <button onclick="applyFilter('grayscale')">Grayscale</button>
        <button onclick="applyFilter('sepia')">Sepia</button>
        <button onclick="applyFilter('vivid')">Vivid</button>
    `;
}

window.applyFilter = (type) => {
    const { canvas, ctx } = getEditor();

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        let r = data[i], g = data[i+1], b = data[i+2];

        if (type === 'grayscale') {
            const gray = (r + g + b) / 3;
            r = g = b = gray;
        }

        if (type === 'sepia') {
            r = r * 0.393 + g * 0.769 + b * 0.189;
            g = r * 0.349 + g * 0.686 + b * 0.168;
            b = r * 0.272 + g * 0.534 + b * 0.131;
        }

        if (type === 'vivid') {
            r *= 1.2; g *= 1.2; b *= 1.2;
        }

        data[i] = Math.min(255, r);
        data[i+1] = Math.min(255, g);
        data[i+2] = Math.min(255, b);
    }

    ctx.putImageData(imageData, 0, 0);
    saveHistory();
};

window.showFiltersPanel = showFiltersPanel;
