// core/editor-state.js


export const state = {
    version: "1.0.0"
    canvas: null,
    ctx: null,

    image: null,

    history: [],
    historyIndex: -1,

    
    mouseX: 0,
    mouseY: 0,

  canvasOffsetX: 0,
  canvasOffsetY: 0,

devicePixelRatio:
window.devicePixelRatio || 1,

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

activePanel: null,

    isDirty: false,

    debugMode: true
};
