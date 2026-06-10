// core/panel-engine.js

import { state } from "./editor-state.js";

export function openPanel(title, content = "") {

    const panel =
        document.getElementById("tool-panel");

    if (!panel) return;

    panel.innerHTML = `
        <div class="panel-header">
            <button onclick="closeActivePanel()">✖</button>

            <span>${title}</span>

            <button id="panel-apply-btn">✔</button>
        </div>

        <div class="panel-content">
            ${content}
        </div>
    `;

    panel.classList.add("active");

    state.activePanel = title;
}

export function closePanel() {

    const panel =
        document.getElementById("tool-panel");

    if (!panel) return;

    panel.classList.remove("active");

    panel.innerHTML = "";

    state.activePanel = null;
}
