// startup-check.js

import * as editor from "./editor-core.js";

const required = [
    "triggerUpload",
    "undo",
    "redo",
    "switchTool"
];

required.forEach(fn => {
    if (!editor[fn]) {
        throw new Error(
            `${fn} missing`
        );
    }
});
