import { getEditor } from "../editor-core.js";
import { syncStateImage } from "../core/canvas-engine.js";      
import { saveHistory } from "../core/history-engine.js";  
import { activateTool } from "../core/tool-engine.js";     
import { requireImage } from "../core/guard-engine.js";

let isErasing = false;

export function showEraserPanel() {

    const panel =
        document.getElementById(
            "tool-panel"
        );
    if (!requireImage()) return;

    panel.innerHTML =
        `<div>Drag on image to erase</div>`;

    activateTool(() => {

        const {
            canvas,
            ctx
        } = getEditor();

        function pointerDown() {

            isErasing = true;
        }

        function pointerUp() {

            if (!isErasing)
                return;

            isErasing = false;
            syncStateImage();


            saveHistory();
        }

        function pointerMove(e) {

            if (!isErasing)
                return;

            const rect =
                canvas.getBoundingClientRect();

            const x =
                (e.clientX - rect.left) *
                (canvas.width / rect.width);

            const y =
                (e.clientY - rect.top) *
                (canvas.height / rect.height);

            ctx.clearRect(
                x - 10,
                y - 10,
                20,
                20
            );
        }

        canvas.addEventListener(
            "pointerdown",
            pointerDown
        );

        canvas.addEventListener(
            "pointerup",
            pointerUp
        );

        canvas.addEventListener(
            "pointermove",
            pointerMove
        );

        // cleanup
        return () => {

            isErasing = false;

            canvas.removeEventListener(
                "pointerdown",
                pointerDown
            );

            canvas.removeEventListener(
                "pointerup",
                pointerUp
            );

            canvas.removeEventListener(
                "pointermove",
                pointerMove
            );
        };
    });
}
