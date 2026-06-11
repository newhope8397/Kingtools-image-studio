import { getEditor } from "../editor-core.js";
import { saveHistory } from "../core/history-engine.js";
import { requireImage } from "../core/guard-engine.js";
import { openPanel } from "../core/panel-engine.js";

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

openPanel(
    "Adjust",
`
<label>Brightness</label>

<input
type="range"
min="-100"
max="100"
/>
`
);

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

    const factor = 1 + value / 100;
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
