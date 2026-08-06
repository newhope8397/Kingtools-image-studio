// js/tools/crop/crop-handles.js //  
import { getEditor } from "../../editor-core.js";               

export const HANDLE_SIZE = 14;

export function getHandles(x, y, w, h) {

    return {

        tl:[x,y],

        tm:[x+w/2,y],

        tr:[x+w,y],

        ml:[x,y+h/2],

        mr:[x+w,y+h/2],

        bl:[x,y+h],

        bm:[x+w/2,y+h],

        br:[x+w,y+h]

    };

}

export function drawHandles(x, y, w, h) {

    const { ctx } = getEditor();

    const handles =
        getHandles(x, y, w, h);

    Object.values(handles).forEach(([hx, hy]) => {

        ctx.beginPath();

        ctx.arc(
            hx,
            hy,
            HANDLE_SIZE / 2,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = "#ffffff";
        ctx.fill();

        ctx.strokeStyle = "#a78bfa";
        ctx.lineWidth = 2;
        ctx.stroke();

    });

}
