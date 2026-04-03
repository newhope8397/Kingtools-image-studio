// js/tools/adjust.js
const canvas = document.getElementById('main-canvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });

let originalImageData = null;
let currentValues = { 
    brightness: 100, 
    contrast: 100, 
    saturation: 100, 
    hue: 0, 
    temperature: 0 
};

export function showAdjustPanel() {
    const panel = document.getElementById('tool-panel');
    panel.innerHTML = `
        <div class="flex justify-between items-center mb-4">
            <div class="font-medium">Adjust</div>
            <button onclick="closeToolPanel()" class="text-2xl text-zinc-400">×</button>
        </div>
        <div class="space-y-6">
            ${createSlider('Brightness', 'brightness', 50, 150, 100)}
            ${createSlider('Contrast', 'contrast', 50, 150, 100)}
            ${createSlider('Saturation', 'saturation', 0, 200, 100)}
            ${createSlider('Hue', 'hue', -30, 30, 0)}
            ${createSlider('Temperature', 'temperature', -30, 30, 0)}
        </div>
        <button onclick="resetAdjust()" class="mt-6 w-full py-3 text-sm font-medium bg-zinc-800 hover:bg-zinc-700 rounded-2xl transition">
            Reset All
        </button>
    `;

    if (!originalImageData) {
        originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }
    applyAdjustments();
}

function createSlider(label, key, min, max, defaultValue) {
    return `
        <div>
            <div class="flex justify-between text-sm mb-1">
                <span>${label}</span>
                <span id="( {key}-val"> ){defaultValue}</span>
            </div>
            <input type="range" 
                   min="${min}" 
                   max="${max}" 
                   value="${defaultValue}" 
                   oninput="updateAdjust('${key}', this.value)" 
                   class="w-full accent-violet-500">
        </div>
    `;
}

window.updateAdjust = (key, value) => {
    currentValues[key] = parseFloat(value);
    document.getElementById(`${key}-val`).textContent = Math.round(currentValues[key]);
    applyAdjustments();
};

function applyAdjustments() {
    if (!originalImageData) return;

    const imageData = ctx.createImageData(originalImageData.width, originalImageData.height);
    imageData.data.set(originalImageData.data);
    const data = imageData.data;

    const brightness = currentValues.brightness / 100;
    const contrast = currentValues.contrast / 100;
    const saturation = currentValues.saturation / 100;
    const tempShift = currentValues.temperature;

    for (let i = 0; i < data.length; i += 4) {
        let r = data[i], g = data[i+1], b = data[i+2];

        r = Math.min(255, r + tempShift * 2);
        b = Math.min(255, b - tempShift * 2);

        r = ((r / 255 - 0.5) * contrast + 0.5) * brightness * 255;
        g = ((g / 255 - 0.5) * contrast + 0.5) * brightness * 255;
        b = ((b / 255 - 0.5) * contrast + 0.5) * brightness * 255;

        const gray = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        r = gray + (r - gray) * saturation;
        g = gray + (g - gray) * saturation;
        b = gray + (b - gray) * saturation;

        data[i]     = Math.min(255, Math.max(0, Math.round(r)));
        data[i + 1] = Math.min(255, Math.max(0, Math.round(g)));
        data[i + 2] = Math.min(255, Math.max(0, Math.round(b)));
    }

    ctx.putImageData(imageData, 0, 0);
}

window.resetAdjust = () => {
    currentValues = { brightness: 100, contrast: 100, saturation: 100, hue: 0, temperature: 0 };
    if (originalImageData) {
        ctx.putImageData(originalImageData, 0, 0);
        window.saveHistory();
    }
    showAdjustPanel();
};

export { showAdjustPanel };
