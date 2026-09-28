
const startScreen = document.getElementById("start-screen");
const screen = document.getElementById("screen");


// ==================================================
// CONFIGURAÇÕES
// ==================================================

const characterDelay = 35;
const responseDelay = 500;


// ==================================================
// SOM DO TECLADO
// ==================================================

const soundPool = [];

for (let i = 0; i < 8; i++) {

    const sound = new Audio("./lab.mp3");

    sound.volume = 0.25;
    sound.preload = "auto";

    soundPool.push(sound);
}

let soundIndex = 0;


function playKeySound() {

    const sound = soundPool[soundIndex];

    sound.currentTime = 0;

    sound.play().catch(() => {});

    soundIndex++;

    if (soundIndex >= soundPool.length) {
        soundIndex = 0;
    }
}


// ==================================================
// RESPOSTAS
// ==================================================

function getResponse(input) {

    const text = input
        .toLowerCase()
        .trim();


    // ----------------------------------------------
    // SAUDAÇÕES
    // ----------------------------------------------

    if (
        text === "hello" ||
        text === "hi" ||
        text === "hey" ||
        text === "oi" ||
        text === "olá" ||
        text === "ola"
    ) {
        return "???: HELLO, USER.";
    }


    // ----------------------------------------------
    // STATUS
    // ----------------------------------------------

    if (
        text === "status" ||
        text === "system status"
    ) {
        return "???: ALL SYSTEMS OPERATIONAL.";
    }


    // ----------------------------------------------
    // IDENTIDADE
    // ----------------------------------------------

    if (
        text === "who are you" ||
        text === "quem é você" ||
        text === "quem e voce"
    ) {
        return "???: I AM THE ???";
    }


    // ----------------------------------------------
    // TESTE
    // ----------------------------------------------

    if (
        text === "test" ||
        text === "teste"
    ) {
        return "???: TEST RECEIVED.";
    }


    if (
        text === "G"
    ) {
        return "???: Ahh G... the seventh letter on the alphabet...";
    }

    
    if (
        text === "you" ||
        text === "você"
    ) {
        return "???: I don't now, i am the guy that made this...";
    }

    
    if (
        text === "gaster" ||
        text === "Gaster"
    ) {
        document.documentElement.innerHTML = "";
        document.body.style.background = "#000";
        return "";
    }

    if (
        text === "secret" ||
        text === "secrets"
    ) {
        return "???: A lot";
    }
    

    if (        
        text === "iza" ||
        text === "Iza"
    ) {
        return "???: Insteresting... Name...";
    }   
    
    // ----------------------------------------------
    // CLEAR
    // ----------------------------------------------

    if (
        text === "clear" ||
        text === "limpar"
    ) {
        return "__CLEAR__";
    }


    // ----------------------------------------------
    // COMANDO DESCONHECIDO
    // ----------------------------------------------

    return "SYSTEM: COMMAND NOT RECOGNIZED.";
}


// ==================================================
// ESCREVER TEXTO PROGRESSIVAMENTE
// ==================================================

function typeText(text, callback) {

    const line = document.createElement("div");

    line.className = "line system-line";

    screen.appendChild(line);

    let index = 0;


    function writeCharacter() {

        if (index >= text.length) {

            if (callback) {
                callback();
            }

            return;
        }


        const character = text[index];

        line.textContent += character;

        playKeySound();

        index++;

        setTimeout(writeCharacter, characterDelay);
    }


    writeCharacter();
}


// ==================================================
// CRIAR INPUT
// ==================================================

function createInput() {

    const line = document.createElement("div");

    line.className = "input-line";


    const prompt = document.createElement("span");

    prompt.className = "prompt";

    prompt.textContent = "> ";


    const input = document.createElement("input");

    input.id = "command-input";

    input.type = "text";

    input.autocomplete = "off";

    input.spellcheck = false;


    line.appendChild(prompt);
    line.appendChild(input);

    screen.appendChild(line);


    input.focus();


    // ----------------------------------------------
    // SOM ENQUANTO DIGITA
    // ----------------------------------------------

    input.addEventListener("keydown", (event) => {

        if (event.key.length === 1) {
            playKeySound();
        }

    });


    // ----------------------------------------------
    // ENTER
    // ----------------------------------------------

    input.addEventListener("keydown", (event) => {

        if (event.key !== "Enter") {
            return;
        }


        const command = input.value.trim();


        if (command.length === 0) {
            return;
        }


        // Remove o input atual
        line.remove();


        // Mostra o que o usuário escreveu
        const userLine = document.createElement("div");

        userLine.className = "line user-line";

        userLine.textContent = "> " + command;

        screen.appendChild(userLine);


        // Descobre a resposta
        const response = getResponse(command);


        // CLEAR
        if (response === "__CLEAR__") {

            screen.innerHTML = "";

            createInput();

            return;
        }


        // Resposta progressiva
        setTimeout(() => {

            typeText(response, () => {

                setTimeout(() => {

                    createInput();

                }, responseDelay);

            });

        }, responseDelay);

    });
}


// ==================================================
// SEQUÊNCIA INICIAL
// ==================================================

const startupLines = [
    "SERVER RUNE CONNECTION",
    "-------------------------",
    "SYSTEM INITIALIZED...",
    "CONNECTION: OK",
    "DATABASE: ONLINE",
    "-------------------------"
];

let startupIndex = 0;


function startup() {

    if (startupIndex >= startupLines.length) {

        setTimeout(() => {
            createInput();
        }, responseDelay);

        return;
    }


    typeStartupLine(startupLines[startupIndex]);
}


function typeStartupLine(text) {

    const line = document.createElement("div");

    line.className = "line";

    screen.appendChild(line);

    let index = 0;


    function writeCharacter() {

        if (index >= text.length) {

            startupIndex++;

            setTimeout(startup, responseDelay);

            return;
        }


        line.textContent += text[index];

        playKeySound();

        index++;

        setTimeout(writeCharacter, characterDelay);
    }


    writeCharacter();
}

const backgroundMusic = document.getElementById("background-music");

const targetVolume = 0.4;
const fadeDuration = 3000; // 3 segundos

backgroundMusic.volume = 0;


// ========================================
// FADE IN DA MÚSICA
// ========================================

function fadeInMusic() {

    backgroundMusic.volume = 0;

    backgroundMusic.play().catch(() => {});

    const startTime = performance.now();

    function fade() {

        const elapsed = performance.now() - startTime;

        const progress = Math.min(elapsed / fadeDuration, 1);

        backgroundMusic.volume = targetVolume * progress;

        if (progress < 1) {
            requestAnimationFrame(fade);
        }
    }

    requestAnimationFrame(fade);
}


// ========================================
// CLICK TO START
// ========================================

let started = false;

startScreen.addEventListener("click", () => {

    if (started) {
        return;
    }

    started = true;

    startScreen.classList.add("hidden");

    // Música com fade in
    fadeInMusic();

    // Começa o laboratório
    startup();

});
