// js/core/panel-engine.js

export function openPanel(
    content
) {

    const panel =
        document.getElementById(
            "tool-panel"
        );

    if (!panel) return;

    panel.innerHTML = content;

    panel.classList.add(
        "active"
    );
}

export function closePanel() {

    const panel =
        document.getElementById(
            "tool-panel"
        );

    if (!panel) return;

    panel.classList.remove(
        "active"
    );
}
