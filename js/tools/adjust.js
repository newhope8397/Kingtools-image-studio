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

    if (!originalImageData) originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    applyAdjustments();
}

function createSlider(label, key, min, max, defaultValue) {
    return `
        <div>
            <div class="flex justify-between text-sm mb-1">
                <span>${label}</span>
                <span id="\( {key}-val"> \){defaultValue}</span>
            </div>
            <input type="range" min="\( {min}" max=" \){max}" value="${defaultValue}" 
                   oninput="updateAdjust('${key}', this.value)" class="w-full accent-violet-500">
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
    const contrastFactor = currentValues.contrast / 100;
    const saturation = currentValues.saturation / 100;
    const hueShift = currentValues.hue;
    const tempShift = currentValues.temperature;

    for (let i = 0; i < data.length; i += 4) {
        let r = data[i], g = data[i+1], b = data[i+2];

        // Temperature
        r = Math.min(255, r + tempShift * 2.5);
        b = Math.min(255, b - tempShift * 2.5);

        // Brightness + Contrast
        r = ((r / 255 - 0.5) * contrastFactor + 0.5) * brightness * 255;
        g = ((g / 255 - 0.5) * contrastFactor + 0.5) * brightness * 255;
        b = ((b / 255 - 0.5) * contrastFactor + 0.5) * brightness * 255;

        // Saturation
        const gray = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        r = gray + (r - gray) * saturation;
        g = gray + (g - gray) * saturation;
        b = gray + (b - gray) * saturation;

        // Hue (simple HSL shift)
        if (hueShift !== 0) {
            const hsl = rgbToHsl(r, g, b);
            hsl.h = (hsl.h + hueShift + 360) % 360;
            const rgb = hslToRgb(hsl.h, hsl.s, hsl.l);
            r = rgb.r; g = rgb.g; b = rgb.b;
        }

        data[i]     = Math.min(255, Math.max(0, Math.round(r)));
        data[i + 1] = Math.min(255, Math.max(0, Math.round(g)));
        data[i + 2] = Math.min(255, Math.max(0, Math.round(b)));
    }

    ctx.putImageData(imageData, 0, 0);
}

// Helper functions for Hue
function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) h = s = 0;
    else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h: h * 360, s, l };
}
function hslToRgb(h, s, l) {
    h /= 360;
    let r, g, b;
    if (s === 0) r = g = b = l;
    else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

window.resetAdjust = () => {
    currentValues = { brightness: 100, contrast: 100, saturation: 100, hue: 0, temperature: 0 };
    if (originalImageData) {
        ctx.putImageData(originalImageData, 0, 0);
        window.saveHistory();
    }
    showAdjustPanel();
};

// Expose to window for switchTool
window.showAdjustPanel = showAdjustPanel;
export { showAdjustPanel };
