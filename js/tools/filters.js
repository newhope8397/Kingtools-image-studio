import { getEditor } from '../editor-core.js';
import { commitCanvas } from "../core/canvas-engine.js";

import { requireImage } from "../core/guard-engine.js";
import { openPanel } from "../core/panel-engine.js";

export function showFiltersPanel() {
    
    if (!requireImage()) return;
    openPanel(
    "Filters",
`
<button onclick="applyFilter('grayscale')">
Grayscale
</button>

<button onclick="applyFilter('sepia')">
Sepia
</button>
`
);
}

window.applyFilter = (type) => {
    const { canvas, ctx } = getEditor();

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const filters = {

    grayscale(r,g,b){
        const gray = (r+g+b)/3;
        return [gray,gray,gray];
    },

    sepia(r,g,b){
        return[
            r*0.393 + g*0.769 + b*0.189,
            r*0.349 + g*0.686 + b*0.168,
            r*0.272 + g*0.534 + b*0.131
        ];
    },

    vivid(r,g,b){
        return[
            r*1.2,
            g*1.2,
            b*1.2
        ];
    }

};

const fn = filters[type];

if(!fn) return;

for(let i=0;i<data.length;i+=4){

    const [r,g,b]=fn(
        data[i],
        data[i+1],
        data[i+2]
    );

    data[i]=Math.min(255,r);
    data[i+1]=Math.min(255,g);
    data[i+2]=Math.min(255,b);
}
    ctx.putImageData(imageData, 0, 0);
    commitCanvas();

};

window.showFiltersPanel = showFiltersPanel;
