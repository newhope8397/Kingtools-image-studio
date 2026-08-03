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
