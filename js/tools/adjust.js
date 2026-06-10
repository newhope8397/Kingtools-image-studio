import { getEditor } from "../editor-core.js";
import { saveHistory } from "../core/history-engine.js";
import { requireImage } from "../core/guard-engine.js";

let originalImageData = null;

export function showAdjustPanel() {

    const {
        canvas,
        ctx
    } = getEditor();
    if (!requireImage()) return;

    originalImageData =
        ctx.getImageData(
            0,
            0,
            canvas.width,
            canvas.height
        );

    const panel =
        document.getElementById(
            "tool-panel"
        );

    panel.innerHTML = `
        <div class="p-4">

            <div>Brightness</div>

            <input
                type="range"
                min="50"
                max="150"
                value="100"
                oninput="adjustBrightness(this.value)"
            >

            <button
                onclick="applyBrightness()"
            >
                Apply
            </button>

        </div>
    `;
}

window.adjustBrightness = (value) => {

    const {
        canvas,
        ctx
    } = getEditor();

    const imageData =
        new ImageData(
            new Uint8ClampedArray(
                originalImageData.data
            ),
            originalImageData.width,
            originalImageData.height
        );

    const data =
        imageData.data;

    const factor =
        value / 100;

    for (
        let i = 0;
        i < data.length;
        i += 4
    ) {

        data[i] *= factor;
        data[i + 1] *= factor;
        data[i + 2] *= factor;
    }

    ctx.putImageData(
        imageData,
        0,
        0
    );
};

window.applyBrightness = () => {

    saveHistory();
};
