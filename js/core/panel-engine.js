import { state } from "./editor-state.js";
import { deactivateTool } from "./tool-engine.js";

export function openPanel(
    title,
    content = "",
    onApply = null,
    onClose = null
) {

    const panel =
        document.getElementById(
            "tool-panel"
        );

    if (!panel) return;

    closePanel();

    panel.innerHTML = `
        <div class="panel-header">

            <button
            id="panel-close-btn">
                ✖
            </button>

            <span>${title}</span>

            <button
            id="panel-apply-btn">
                ✔
            </button>

        </div>

        <div class="panel-content">
            ${content}
        </div>
    `;

    panel.classList.add("active");

    state.activePanel = title;

 const closeBtn =
document.getElementById(
    "panel-close-btn"
);

const applyBtn =
document.getElementById(
    "panel-apply-btn"
);

closeBtn?.addEventListener(
    "click",
    () => {

        if(onClose)
            onClose();

        closePanel();
    }
);

applyBtn?.addEventListener(
    "click",
    () => {

        if(onApply)
            onApply();
    }
);
}

export function closePanel() {

    const panel =
        document.getElementById(
            "tool-panel"
        );

    if (!panel) return;
    deactivateTool();

    panel.classList.remove(
        "active"
    );

    panel.innerHTML = "";

    state.activePanel = null;
}
