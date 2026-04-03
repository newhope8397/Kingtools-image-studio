// js/tools/effects.js
const canvas = document.getElementById('main-canvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });

let originalImageData = null;

export function showEffectsPanel() {
    const panel = document.getElementById('tool-panel');
    panel.innerHTML = `
        <div class="flex justify-between items-center mb-4">
            <div class="font-medium">Effects</div>
            <button onclick="closeToolPanel()" class="text-2xl text-zinc-400">×</button>
        </div>
        <div class="grid grid-cols-2 gap-3">
            <div onclick="applyEffect('vignette')" class="bg-zinc-800 hover:bg-zinc-700 p-6 rounded-3xl text-center cursor-pointer transition">Vignette</div>
            <div onclick="applyEffect('sharpen')" class="bg-zinc-800 hover:bg-zinc-700 p-6 rounded-3xl text-center cursor-pointer transition">Sharpen</div>
            <div onclick="applyEffect('grain')" class="bg-zinc-800 hover:bg-zinc-700 p-6 rounded-3xl text-center cursor-pointer transition">Film Grain</div>
            <div onclick="applyEffect('blur')" class="bg-zinc-800 hover:bg-zinc-700 p-6 rounded-3xl text-center cursor-pointer transition">Soft Blur</div>
            <div onclick="applyEffect('glow')" class="bg-zinc-800 hover:bg-zinc-700 p-6 rounded-3xl text-center cursor-pointer transition">Glow</div>
            <div onclick="applyEffect('duotone')" class="bg-zinc-800 hover:bg-zinc-700 p-6 rounded-3xl text-center cursor-pointer transition">Duotone</div>
        </div>
        <button onclick="resetToOriginalEffect()" 
                class="mt-6 w-full py-3 text-sm font-medium bg-zinc-800 hover:bg-zinc-700 rounded-2xl transition">
            Reset to Original
        </button>
    `;

    if (!originalImageData) {
        originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }
}

window.applyEffect = (type) => {
    if (!originalImageData) return;
    ctx.putImageData(originalImageData, 0, 0);

    if (type === 'none') {
        window.saveHistory();
        return;
    }

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const width = canvas.width;

    for (let i = 0; i < data.length; i += 4) {
        let r = data[i], g = data[i+1], b = data[i+2];
        const x = (i / 4) % width;
        const y = Math.floor((i / 4) / width);

        switch (type) {
            case 'vignette':
                const dist = Math.sqrt(Math.pow(x - width/2, 2) + Math.pow(y - canvas.height/2, 2));
                const vignette = Math.max(0, 1 - dist / (Math.max(width, canvas.height) * 0.7));
                r *= vignette * 0.85 + 0.15;
                g *= vignette * 0.85 + 0.15;
                b *= vignette * 0.85 + 0.15;
                break;
            case 'sharpen':
                // Simple sharpen (approximation via contrast boost on edges)
                if (x > 1 && y > 1 && x < width-1) {
                    r = Math.min(255, r * 1.4);
                    g = Math.min(255, g * 1.4);
                    b = Math.min(255, b * 1.4);
                }
                break;
            case 'grain':
                const noise = Math.random() * 30 - 15;
                r = Math.min(255, Math.max(0, r + noise));
                g = Math.min(255, Math.max(0, g + noise));
                b = Math.min(255, Math.max(0, b + noise));
                break;
            case 'blur':
                r *= 0.92; g *= 0.92; b *= 0.92;
                break;
            case 'glow':
                r = Math.min(255, r * 1.25);
                g = Math.min(255, g * 1.25);
                b = Math.min(255, b * 1.25);
                break;
            case 'duotone':
                const gray = (r + g + b) / 3;
                r = gray * 0.9 + 40;
                g = gray * 0.6;
                b = gray * 1.3;
                break;
        }

        data[i] = Math.min(255, Math.max(0, Math.round(r)));
        data[i+1] = Math.min(255, Math.max(0, Math.round(g)));
        data[i+2] = Math.min(255, Math.max(0, Math.round(b)));
    }

    ctx.putImageData(imageData, 0, 0);
    window.saveHistory();
};

window.resetToOriginalEffect = () => {
    if (originalImageData) {
        ctx.putImageData(originalImageData, 0, 0);
        window.saveHistory();
    }
};

export { showEffectsPanel };
