// core/render-engine.js//

import { state } from "./editor-state.js";

export function render() {

    if (
        !state.canvas ||
        !state.ctx ||
        !state.image
    ) return;

    const ctx = state.ctx;
    const canvas = state.canvas;

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.save();

    ctx.translate(
        canvas.width / 2,
        canvas.height / 2
    );

    ctx.scale(
        state.zoom,
        state.zoom
    );

    ctx.rotate(
        state.rotation *
        Math.PI / 180
    );

    ctx.drawImage(
        state.image,
        -state.image.width / 2,
        -state.image.height / 2
    );

    ctx.restore();
}
