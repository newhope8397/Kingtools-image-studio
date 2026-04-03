// js/tools/filters.js
const canvas = document.getElementById('main-canvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });

let originalImageData = null;

export function showFiltersPanel() {
    const panel = document.getElementById('tool-panel');
    panel.innerHTML = `
        <div class="flex justify-between items-center mb-4">
            <div class="font-medium">Filters</div>
            <button onclick="closeToolPanel()" class="text-2xl text-zinc-400">×</button>
        </div>
        <div class="grid grid-cols-3 gap-3 text-center">
            <div onclick="applyFilter('none')" class="bg-zinc-800 hover:bg-zinc-700 p-4 rounded-2xl cursor-pointer">Original</div>
            <div onclick="applyFilter('grayscale')" class="bg-zinc-800 hover:bg-zinc-700 p-4 rounded-2xl cursor-pointer">B&W</div>
            <div onclick="applyFilter('sepia')" class="bg-zinc-800 hover:bg-zinc-700 p-4 rounded-2xl cursor-pointer">Sepia</div>
            <div onclick="applyFilter('warm')" class="bg-zinc-800 hover:bg-zinc-700 p-4 rounded-2xl cursor-pointer">Warm</div>
            <div onclick="applyFilter('cool')" class="bg-zinc-800 hover:bg-zinc-700 p-4 rounded-2xl cursor-pointer">Cool</div>
            <div onclick="applyFilter('vintage')" class="bg-zinc-800 hover:bg-zinc-700 p-4 rounded-2xl cursor-pointer">Vintage</div>
            <div onclick="applyFilter('dramatic')" class="bg-zinc-800 hover:bg-zinc-700 p-4 rounded-2xl cursor-pointer">Dramatic</div>
            <div onclick="applyFilter('vivid')" class="bg-zinc-800 hover:bg-zinc-700 p-4 rounded-2xl cursor-pointer">Vivid</div>
            <div onclick="applyFilter('soft')" class="bg-zinc-800 hover:bg-zinc-700 p-4 rounded-2xl cursor-pointer">Soft</div>
            <div onclick="applyFilter('night')" class="bg-zinc-800 hover:bg-zinc-700 p-4 rounded-2xl cursor-pointer">Night</div>
            <div onclick="applyFilter('retro')" class="bg-zinc-800 hover:bg-zinc-700 p-4 rounded-2xl cursor-pointer">Retro</div>
            <div onclick="applyFilter('fade')" class="bg-zinc-800 hover:bg-zinc-700 p-4 rounded-2xl cursor-pointer">Fade</div>
        </div>
        <button onclick="resetToOriginalFilter()" 
                class="mt-6 w-full py-3 text-sm font-medium bg-zinc-800 hover:bg-zinc-700 rounded-2xl transition">
            Reset to Original
        </button>
    `;

    if (!originalImageData) {
        originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }
}

window.applyFilter = (type) => {
    if (!originalImageData) return;

    // Start from original for every filter (non-destructive)
    ctx.putImageData(originalImageData, 0, 0);

    if (type === 'none') {
        window.saveHistory();
        return;
    }

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];

        switch (type) {
            case 'grayscale':
                const gray = 0.2126 * r + 0.7152 * g + 0.0722 * b;
                r = g = b = gray;
                break;
            case 'sepia':
                r = r * 0.393 + g * 0.769 + b * 0.189;
                g = r * 0.349 + g * 0.686 + b * 0.168;
                b = r * 0.272 + g * 0.534 + b * 0.131;
                break;
            case 'warm':
                r = Math.min(255, r * 1.15);
                g = Math.min(255, g * 1.08);
                break;
            case 'cool':
                b = Math.min(255, b * 1.2);
                break;
            case 'vintage':
                r = r * 0.95 + 25;
                g = g * 0.85;
                b = b * 0.75;
                break;
            case 'dramatic':
                r = Math.min(255, r * 1.3);
                g = g * 0.85;
                b = b * 0.7;
                break;
            case 'vivid':
                r = Math.min(255, r * 1.25);
                g = Math.min(255, g * 1.25);
                b = Math.min(255, b * 1.25);
                break;
            case 'soft':
                r = r * 0.95 + 10;
                g = g * 0.95 + 10;
                b = b * 0.95 + 10;
                break;
            case 'night':
                r *= 0.6; g *= 0.7; b = Math.min(255, b * 1.4);
                break;
            case 'retro':
                r = r * 1.1; g *= 0.9; b *= 0.75;
                break;
            case 'fade':
                r = r * 0.9 + 30;
                g = g * 0.9 + 30;
                b = b * 0.9 + 30;
                break;
        }

        data[i]     = Math.min(255, Math.max(0, Math.round(r)));
        data[i + 1] = Math.min(255, Math.max(0, Math.round(g)));
        data[i + 2] = Math.min(255, Math.max(0, Math.round(b)));
    }

    ctx.putImageData(imageData, 0, 0);
    window.saveHistory();
};

window.resetToOriginalFilter = () => {
    if (originalImageData) {
        ctx.putImageData(originalImageData, 0, 0);
        window.saveHistory();
    }
};

export { showFiltersPanel };
