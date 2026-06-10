// core/guard-engine.js

import { state } from "./editor-state.js";

export function requireImage() {

    if (!state.image) {

        alert("Upload image first");

        return false;
    }

    return true;
}
