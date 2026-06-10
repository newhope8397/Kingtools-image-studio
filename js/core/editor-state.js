// core/editor-state.js

export const state = {
    canvas: null,
    ctx: null,

    image: null,

    history: [],
    historyIndex: -1,

    currentFile: null,
    fileType: null,
    fileName: null,

    activeTool: null,
    toolCleanup: null,
    clipboard: null,
    isBusy: false,
    activeSelection: null,

zoom: 1,

rotation: 0,

layers: [],

theme: "dark",

activePanel: null
};
