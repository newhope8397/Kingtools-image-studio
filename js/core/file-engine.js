// core/file-engine.js

let currentFile = null;
let fileType = null;
let fileName = null;

export function setFile {
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
export function triggerUpload() {

    const input =
        document.getElementById(
            "image-upload"
        );

    if (!input) {
        console.error(
            "Upload input not found"
        );
        return;
    }

    input.click();
}

export function getSelectedFile(e) {

    const file =
        e.target.files?.[0];

    if (!file) {
        return null;
    }
    if (!file.type.startsWith("image/")) {

        alert(
            "Please upload a valid image"
        );

        return null;
    }

    setFile(file);

    return file;
}

