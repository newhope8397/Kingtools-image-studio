// js/core/transform-engine.js

import { state } from "./editor-state.js";

export function rotateCanvas(degrees) {

    if (!state.canvas || !state.image) return;

    const canvas = state.canvas;
    const ctx = state.ctx;

    const temp = document.createElement("canvas");
    const tctx = temp.getContext("2d");

    temp.width = canvas.width;
    temp.height = canvas.height;

    tctx.drawImage(canvas, 0, 0);

    const radians =
        degrees * Math.PI / 180;

    canvas.width = temp.height;
    canvas.height = temp.width;

    ctx.save();

    ctx.translate(
        canvas.width / 2,
        canvas.height / 2
    );

    ctx.rotate(radians);

    ctx.drawImage(
        temp,
        -temp.width / 2,
        -temp.height / 2
    );

    ctx.restore();
}

export function flipHorizontal() {

    const canvas = state.canvas;
    const ctx = state.ctx;

    const temp = document.createElement("canvas");
    const tctx = temp.getContext("2d");

    temp.width = canvas.width;
    temp.height = canvas.height;

    tctx.drawImage(canvas, 0, 0);

    ctx.save();

    ctx.scale(-1, 1);

    ctx.drawImage(
        temp,
        -canvas.width,
        0
    );

    ctx.restore();
}

export function flipVertical() {

    const canvas = state.canvas;
    const ctx = state.ctx;

    const temp = document.createElement("canvas");
    const tctx = temp.getContext("2d");

    temp.width = canvas.width;
    temp.height = canvas.height;

    tctx.drawImage(canvas, 0, 0);

    ctx.save();

    ctx.scale(1, -1);

    ctx.drawImage(
        temp,
        0,
        -canvas.height
    );

    ctx.restore();
}
