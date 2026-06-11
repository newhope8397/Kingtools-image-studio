// core/debug-engine.js

export function log(message) {
    console.log(
        `[KingTools] ${message}`
    );
}

export function error(message) {
    console.error(
        `[KingTools Error] ${message}`
    );
}
