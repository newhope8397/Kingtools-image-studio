// core/file-engine.js

let currentFile = null;
let fileType = null;
let fileName = null;

export function setFile(file, type, name) {
    currentFile = file;
    fileType = type;
    fileName = name;
}

export function getFile() {
    return currentFile;
}

export function getFileType() {
    return fileType;
}

export function getFileName() {
    return fileName;
}

export function clearFile() {
    currentFile = null;
    fileType = null;
    fileName = null;
}
