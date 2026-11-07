
/* ==========================================
   SERVER RUNE — FILE SYSTEM
   Navegador de arquivos com JSON externo
========================================== */

// ==========================================
// CONFIGURAÇÃO
// ==========================================

const DATA_PATH = "./DATA/";

const DATA_FILES = {
    files: "files.json",
    documents: "documents.json",
    images: "images.json"
};

// ==========================================
// ELEMENTOS HTML
// ==========================================

const fileList = document.getElementById("file-list");
const pathDisplay = document.getElementById("path");
const itemCount = document.getElementById("item-count");
const emptyMessage = document.getElementById("empty-message");

const backButton = document.getElementById("back-button");
const homeButton = document.getElementById("home-button");

const viewer = document.getElementById("viewer");
const viewerName = document.getElementById("viewer-name");
const viewerContent = document.getElementById("viewer-content");
const viewerStatus = document.getElementById("viewer-status");

const passwordOverlay = document.getElementById("password-overlay");
const passwordForm = document.getElementById("password-form");
const passwordInput = document.getElementById("password-input");
const passwordError = document.getElementById("password-error");
const passwordDescription = document.getElementById("password-description");

// ==========================================
// ESTADO
// ==========================================

let fileSystem = {};
let documents = {};
let images = {};

let currentFolder = "root";
let folderHistory = [];
let pendingFile = null;

// ==========================================
// CARREGAR JSON
// ==========================================

async function loadJSON(filename) {
    const response = await fetch(DATA_PATH + filename);

    if (!response.ok) {
        throw new Error(
            `Não foi possível carregar ${filename}: HTTP ${response.status}`
        );
    }

    return response.json();
}

async function initializeFileSystem() {
    try {
        const [filesData, documentsData, imagesData] = await Promise.all([
            loadJSON(DATA_FILES.files),
            loadJSON(DATA_FILES.documents),
            loadJSON(DATA_FILES.images)
        ]);

        fileSystem = filesData;
        documents = documentsData;
        images = imagesData;

        // Inicia no computador (raiz do files.json).
        openLocation("root");

        console.log("FILE SYSTEM LOADED");
        console.log("FILES:", fileSystem);
        console.log("DOCUMENTS:", documents);
        console.log("IMAGES:", images);

    } catch (error) {
        console.error("FILE SYSTEM LOAD ERROR:", error);
        showViewerMessage(
            "SYSTEM ERROR",
            "ERROR: COULD NOT LOAD FILE SYSTEM. CHECK THE JSON FILES."
        );
    }
}

// ==========================================
// NAVEGAÇÃO
// ==========================================

// Abre uma pasta existente no files.json.
function navigateTo(folderId) {
    if (!fileSystem[folderId]) {
        console.error("FOLDER NOT FOUND:", folderId);
        return;
    }

    if (folderId === currentFolder) return;

    folderHistory.push(currentFolder);
    currentFolder = folderId;

    renderFolder();
    updateSidebar();
}

// Abre uma localização da sidebar sem acumular histórico.
function openLocation(location) {
    const folderId = location.toLowerCase();

    if (!fileSystem[folderId]) {
        showViewerMessage(
            "SYSTEM",
            `DIRECTORY NOT FOUND: ${location.toUpperCase()}`
        );
        console.error(
            `A pasta "${folderId}" não existe como chave no files.json.`
        );
        return;
    }

    currentFolder = folderId;
    folderHistory = [];

    closeViewer();
    closePasswordWindow();

    renderFolder();
    updateSidebar();
}

function goBack() {
    if (folderHistory.length === 0) return;

    currentFolder = folderHistory.pop();

    closeViewer();
    renderFolder();
    updateSidebar();
}

function goHome() {
    openLocation("root");
}

// ==========================================
// SIDEBAR
// ==========================================

function openSidebarTab(location) {
    // As abas usam os IDs existentes no files.json.
    openLocation(location);
}

function updateSidebar() {
    document.querySelectorAll(".side-link").forEach(button => {
        button.classList.toggle(
            "selected",
            button.dataset.location.toLowerCase() === currentFolder
        );
    });
}

// ==========================================
// CAMINHO DA PASTA
// ==========================================

function getParentFolder(targetId) {
    for (const [id, folder] of Object.entries(fileSystem)) {
        const children = folder.children || [];

        if (children.some(item =>
            item.type === "folder" && item.target === targetId
        )) {
            return id;
        }
    }

    return null;
}

function getFolderPath(folderId) {
    if (folderId === "root") return "";

    const parts = [];
    let current = folderId;
    let safetyCounter = 0;

    while (
        current &&
        current !== "root" &&
        safetyCounter < 100
    ) {
        const folder = fileSystem[current];

        if (!folder) break;

        parts.unshift(folder.name || current);
        current = getParentFolder(current);
        safetyCounter++;
    }

    return parts.join("\\");
}

// ==========================================
// LISTAR CONTEÚDO DA PASTA
// ==========================================

function renderFolder() {
    const folder = fileSystem[currentFolder];

    if (!folder) {
        console.error("CURRENT FOLDER DOES NOT EXIST:", currentFolder);
        return;
    }

    fileList.replaceChildren();

    const children = folder.children || [];
    const folderPath = getFolderPath(currentFolder);

    pathDisplay.textContent =
        "C:\\" + (folderPath ? folderPath + "\\" : "");

    itemCount.textContent =
        `${children.length} OBJECT${children.length === 1 ? "" : "S"}`;

    emptyMessage.hidden = children.length !== 0;
    backButton.disabled = folderHistory.length === 0;

    children.forEach(file => {
        const row = document.createElement("button");
        row.className = "file-row";
        row.type = "button";

        const name = document.createElement("span");
        name.className = "file-name";

        const icon = document.createElement("span");
        icon.className = "file-icon";

        const label = document.createElement("span");
        label.textContent = file.name;

        const type = document.createElement("span");
        type.className = "file-type";

        const status = document.createElement("span");
        status.className = "file-status";

        if (file.type === "folder") {
            icon.textContent = file.locked ? "[!]" : "[+]";
            type.textContent = "FOLDER";
            status.textContent = file.locked ? "LOCKED" : "DIRECTORY";
        } else {
            icon.textContent = getFileIcon(file);
            type.textContent = getFileType(file);
            status.textContent = file.locked ? "LOCKED" : "READY";
        }

        if (file.locked) {
            status.classList.add("locked");
        }

        name.append(icon, label);
        row.append(name, type, status);

        row.addEventListener("click", () => openFile(file));

        fileList.appendChild(row);
    });
}

function getFileIcon(file) {
    if (file.locked) return "[!]";
    if (file.type === "image") return "[#]";
    return "[T]";
}

function getFileType(file) {
    if (file.type === "image") return "IMAGE";
    if (file.type === "text") return "TXT";
    return "FILE";
}

// ==========================================
// BUSCAR DADOS DOS ARQUIVOS
// ==========================================

function getFileData(file) {
    if (!file) return null;

    if (file.source === "documents") {
        return documents[file.key] || null;
    }

    if (file.source === "images") {
        return images[file.key] || null;
    }

    return null;
}

// ==========================================
// ABRIR ARQUIVOS E PASTAS
// ==========================================

function openFile(file) {
    console.log("ARQUIVO CLICADO:", file);

    // Pastas
    if (file.type === "folder") {
        if (file.locked) {
            pendingFile = {
                ...file,
                isFolder: true
            };

            openPasswordWindow(pendingFile);
            return;
        }

        navigateTo(file.target);
        return;
    }

    // Arquivos
    const data = getFileData(file);

    console.log("DADOS ENCONTRADOS:", data);

    if (!data) {
        showViewerMessage(
            file.name,
            "ERROR: FILE CONTENT NOT FOUND."
        );

        console.error("Verifique source e key:", file);
        return;
    }

    // Arquivo protegido
    if (file.locked || data.locked) {
        pendingFile = {
            ...file,
            resolvedData: data
        };

        openPasswordWindow(pendingFile);
        return;
    }

    displayFile(file, data);
}

// ==========================================
// VISUALIZADOR
// ==========================================

function showViewerMessage(name, message) {
    viewerName.textContent = name;
    viewerContent.replaceChildren();
    viewerContent.textContent = message;
    viewerStatus.textContent = "SYSTEM MESSAGE";
    viewer.hidden = false;
}

function displayFile(file, data) {
    if (!data) {
        showViewerMessage(file.name, "ERROR: FILE CONTENT NOT FOUND.");
        return;
    }

    viewerName.textContent = file.name;
    viewerContent.replaceChildren();

    if (file.type === "image" || data.type === "image") {
        const image = document.createElement("img");

        image.src = data.src || file.src || "";
        image.alt = data.caption || file.name;

        image.addEventListener("error", () => {
            viewerContent.replaceChildren();
            viewerContent.textContent = "ERROR: IMAGE DATA NOT FOUND.";
        });

        viewerContent.appendChild(image);

        const captionText = data.caption || file.caption;

        if (captionText) {
            const caption = document.createElement("div");
            caption.className = "image-caption";
            caption.textContent = captionText;
            viewerContent.appendChild(caption);
        }
    } else {
        let content = data.content || "";

        if (data.encrypted === true) {
            try {
                content = decodeBase64UTF8(content);
            } catch (error) {
                console.error("DECODE ERROR:", error);
                content = "ERROR: COULD NOT DECODE FILE.";
            }
        }

        viewerContent.textContent = content || "THIS FILE IS EMPTY.";
    }

    viewerStatus.textContent = "READ ONLY";
    viewer.hidden = false;
}

function decodeBase64UTF8(value) {
    const binary = atob(value);
    const bytes = Uint8Array.from(
        binary,
        character => character.charCodeAt(0)
    );

    return new TextDecoder()
        .decode(bytes)
        .replace(/\\n/g, "\n");
}

function closeViewer() {
    viewer.hidden = true;
}

// ==========================================
// SENHAS
// ==========================================

async function sha256(text) {
    const data = new TextEncoder().encode(text);
    const hash = await crypto.subtle.digest("SHA-256", data);

    return Array.from(new Uint8Array(hash))
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");
}

function openPasswordWindow(file) {
    passwordDescription.textContent =
        "PASSWORD REQUIRED FOR: " + file.name;

    passwordInput.value = "";
    passwordError.textContent = "";
    passwordOverlay.hidden = false;

    setTimeout(() => passwordInput.focus(), 0);
}

function closePasswordWindow() {
    passwordOverlay.hidden = true;
    pendingFile = null;
    passwordInput.value = "";
    passwordError.textContent = "";
}

passwordForm.addEventListener("submit", async event => {
    event.preventDefault();

    if (!pendingFile) return;

    const file = pendingFile;
    const data = file.resolvedData || getFileData(file);
    const enteredPassword = passwordInput.value;

    let valid = false;

    // Pastas usam passwordHash no files.json.
    if (file.passwordHash) {
        valid = (await sha256(enteredPassword)) === file.passwordHash;
    }
    // Arquivos podem usar passwordHash ou password no JSON de conteúdo.
    else if (data?.passwordHash) {
        valid = (await sha256(enteredPassword)) === data.passwordHash;
    } else if (data?.password !== undefined) {
        valid = enteredPassword === String(data.password);
    }

    if (!valid) {
        passwordError.textContent = "INCORRECT PASSWORD.";
        return;
    }

    closePasswordWindow();

    if (file.isFolder) {
        navigateTo(file.target);
    } else {
        displayFile(file, data);
    }
});

// ==========================================
// EVENTOS
// ==========================================

backButton.addEventListener("click", goBack);
homeButton.addEventListener("click", goHome);

document.querySelectorAll(".side-link").forEach(button => {
    button.addEventListener("click", () => {
        openSidebarTab(button.dataset.location);
    });
});

document.getElementById("close-viewer")
    .addEventListener("click", closeViewer);

document.getElementById("viewer-close-bottom")
    .addEventListener("click", closeViewer);

document.getElementById("close-password")
    .addEventListener("click", closePasswordWindow);

document.getElementById("cancel-password")
    .addEventListener("click", closePasswordWindow);

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeViewer();
        closePasswordWindow();
    }
});

// ==========================================
// INICIAR
// ==========================================

initializeFileSystem();
