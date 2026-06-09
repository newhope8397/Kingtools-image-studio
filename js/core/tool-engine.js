// js/core/tool-engine.js

let cleanupCurrentTool = null;

export function activateTool(initTool) {

    // cleanup previous tool
    if (cleanupCurrentTool) {

        cleanupCurrentTool();

        cleanupCurrentTool = null;
    }

    // start new tool
    cleanupCurrentTool = initTool();
}

export function deactivateTool() {

    if (cleanupCurrentTool) {

        cleanupCurrentTool();

        cleanupCurrentTool = null;
    }
}
