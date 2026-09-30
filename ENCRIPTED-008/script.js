
const startScreen = document.getElementById("start-screen");
const screen = document.getElementById("screen");


// ==================================================
// CONFIGURAÇÕES
// ==================================================

const characterDelay = 35;
const responseDelay = 500;



function dec(value) {
    return atob(value);
}


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


function getResponse(input) {

    const text = input
        .toLowerCase()
        .trim();


    if (
        text === dec("aGVsbG8=") ||
        text === dec("aGk=") ||
        text === dec("aGV5") ||
        text === dec("b2k=") ||
        text === dec("b2zDoQ==") ||
        text === dec("b2xh")
    ) {
        return dec("Pz8/OiBIRUxMTywgVVNFUiwgWU9VIFdBTlQgVE8gREVDT0RFIFNPTUVUSElORz8=");
    }


    if (
        text === dec("c3RhdHVz") ||
        text === dec("c3lzdGVtIHN0YXR1cw==")
    ) {
        return dec("Pz8/OiBBTEwgU1lTVEVNUyBPUEVSQVRJT05BTC4=");
    }
    if (
        text === dec("c29manNza2RuZmc=")
    ) {
        return dec("Pz8/OiBGSVJTVCBESUdJVCBPRiBUSEUgUEFTU1dPUkQgSVMgMw==");
    }


    if (
        text === dec("d2hvIGFyZSB5b3U=") ||
        text === dec("cXVlbSDDqSB2b2PDqg==") ||
        text === dec("cXVlbSBlIHZvY2U=")
    ) {
        return dec("Pz8/OiBJIEFNIFRIRSA/Pz8=");
    }


    if (
        text === dec("dGVzdA==") ||
        text === dec("dGVzdGU=")
    ) {
        return dec("Pz8/OiBURVNUIFJFQ0VJVkVELg==");
    }


    if (
        text === dec("Zw==")
    ) {
        return dec("Pz8/OiBBaGggRy4uLiB0aGUgc2V2ZW50aCBsZXR0ZXIgb24gdGhlIGFscGhhYmV0Li4u");
    }


    if (
        text === dec("eW91") ||
        text === dec("dm9jw6o=")
    ) {
        return dec("Pz8/OiBJIGRvbid0IGtub3csIGkgYW0gdGhlIGd1eSB0aGF0IG1hZGUgdGhpcy4uLg==");
    }


    if (
        text === dec("Z2FzdGVy")
    ) {
        document.documentElement.innerHTML = "";
        document.body.style.background = "#000";
        return "";
    }


    if (
        text === dec("c2VjcmV0") ||
        text === dec("c2VjcmV0cw==")
    ) {
        return dec("Pz8/OiBBIGxvdA==");
    }


    if (
        text === dec("aXph")
    ) {
        return dec("Pz8/OiBJbnN0ZXJlc3RpbmcuLi4gTmFtZS4uLg==");
    }


    if (
        text === dec("Zm9yZ290dGVu") ||
        text === dec("Zm9yZ290dGVuIG1hbg==") ||
        text === dec("bWFuIGZvcmdvdHRlbg==") ||
        text === dec("Zm9yZ290IG1hbg==") ||
        text === dec("bWFuIGZvcmdvdA==") ||
        text === dec("Zm9yZ290ZW4=") ||
        text === dec("Zm9yZ290ZW4gbWFu") ||
        text === dec("Zm9yZ290ZW4gcGVyc29u") ||
        text === dec("Zm9yZ290IG1hbg==")
    ) {
        window.location.href = dec("Li9FTkNSSVBURUQtMDEwL0VOQ1JJUFRFRC5odG1s");
        return "";
    }


    if (
        text === dec("Y2xlYXI=") ||
        text === dec("bGltcGFy")
    ) {
        return dec("X19DTEVBUlRfXw==");
    }


    return dec("U1lTVEVNOiBDT01NQU5EIE5PVCBSRUNPR05JWkVELg==");
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


        line.remove();


        // ------------------------------------------
        // MOSTRA O COMANDO DO USUÁRIO
        // ------------------------------------------

        const userLine = document.createElement("div");

        userLine.className = "line user-line";

        userLine.textContent = "> " + command;

        screen.appendChild(userLine);


        // ------------------------------------------
        // DESCOBRE A RESPOSTA
        // ------------------------------------------

        const response = getResponse(command);



        if (response === dec("X19DTEVBUlRfXw==")) {

            screen.innerHTML = "";

            createInput();

            return;
        }


        // ------------------------------------------
        // RESPOSTA PROGRESSIVA
        // ------------------------------------------

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
    dec("U0VSVkVSIFJVTkUgQ09OTkVDVElPTg=="),
    dec("LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0t"),
    dec("U1lTVEVNIElOSVRJQUxJWkVELi4u"),
    dec("Q09OTkVDVElPTjogT0s="),
    dec("REFUQUJBU0U6IE9OTElORQ=="),
    dec("Q09OTkVDVEVELCBMQUIgLSBUQUxLIE9SIEFTSyBUTyBERUNPREUgU09NRVRISU5H"),
    dec("LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0t")
    
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


// ==================================================
// MÚSICA
// ==================================================

const backgroundMusic = document.getElementById("background-music");

const targetVolume = 0.4;
const fadeDuration = 3000;

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

    fadeInMusic();

    startup();

});

