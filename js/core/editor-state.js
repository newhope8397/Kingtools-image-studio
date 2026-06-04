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
    isBusy: false
};
