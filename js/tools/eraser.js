import { getEditor } from "../editor-core.js";
import { commitCanvas } from "../core/canvas-engine.js";
import { openPanel }
from "../core/panel-engine.js";

import { getCanvasPos }
from "../core/event-engine.js";

import { activateTool } from "../core/tool-engine.js";     
import { requireImage } from "../core/guard-engine.js";

let isErasing = false;

export function showEraserPanel() {

    
    if (!requireImage()) return;

    openPanel(
    "Eraser",
`
Drag on image to erase.
`
);
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
            
            commitCanvas();

        }

        function pointerMove(e) {

            if (!isErasing)
                return;

    
    const pos = getCanvasPos(e);

    ctx.clearRect(
        pos.x - 10,
        pos.y - 10,
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
