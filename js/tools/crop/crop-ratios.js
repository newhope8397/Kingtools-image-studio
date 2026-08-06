// js/tools/crop/crop-ratios.js

import { cropState }
from "./crop-state.js";

export const RATIOS = {

    free:null,

    square:1,

    portrait:4/5,

    landscape:16/9,

    instagram:1,

    story:9/16,

    classic:4/3

};

export function setAspect(name){

    cropState.aspect =
        name;

}

export function getAspect(){

    return cropState.aspect;

}

export function applyAspect(
    width,
    height
){

    if(
        cropState.aspect==="free"
    ){

        return{
            width,
            height
        };

    }

    const ratio =
        RATIOS[
            cropState.aspect
        ];

    if(!ratio){

        return{
            width,
            height
        };

    }

    return{

        width,

        height:
        width/ratio

    };

}
