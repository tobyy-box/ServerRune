
// ========================================
// SERVER RUNE - SCRIPT.JS
// ========================================


// ========================================
// ENTER BUTTON
// ========================================

const enterButton = document.getElementById("enter");

if (enterButton) {

    enterButton.addEventListener("click", () => {

        window.location.href = "./...-/";

    });

}


// ========================================
// TEAM MEMBERS
// ========================================

const teamMembers = document.querySelectorAll(".team-member");

teamMembers.forEach((member) => {

    const button = member.querySelector(".team-name");

    if (!button) return;

    button.addEventListener("click", () => {

        teamMembers.forEach((otherMember) => {

            if (otherMember !== member) {
                otherMember.classList.remove("open");
            }

        });

        member.classList.toggle("open");

    });

});


// ========================================
// MUSIC PLAYER
// ========================================

const musicTracks = document.querySelectorAll(".music-track");

let currentlyPlaying = null;


musicTracks.forEach((track) => {

    const audio = track.querySelector("audio");
    const playButton = track.querySelector(".music-play");
    const progressBar = track.querySelector(".progress-bar");
    const currentTimeElement = track.querySelector(".track-current");
    const durationElement = track.querySelector(".track-duration");


    if (!audio || !playButton) return;


    // ========================================
    // BPM
    // ========================================

    const bpm = Number(track.dataset.bpm);

    if (bpm > 0) {

        const beatDuration = 60 / bpm;

        track.style.setProperty(
            "--beat-duration",
            `${beatDuration}s`
        );

    }


    // ========================================
    // FORMATA TEMPO
    // ========================================

    function formatTime(seconds) {

        if (!isFinite(seconds)) {
            return "0:00";
        }

        const minutes = Math.floor(seconds / 60);

        const remainingSeconds =
            Math.floor(seconds % 60);

        return `${minutes}:${remainingSeconds
            .toString()
            .padStart(2, "0")}`;

    }


    // ========================================
    // DURAÇÃO
    // ========================================

    audio.addEventListener("loadedmetadata", () => {

        if (durationElement) {

            durationElement.textContent =
                formatTime(audio.duration);

        }

        if (progressBar) {

            progressBar.max = audio.duration;
            progressBar.value = 0;

        }

    });


    // ========================================
    // PLAY / PAUSE
    // ========================================

    playButton.addEventListener("click", () => {


        // ----------------------------------------
        // PAUSAR OUTRAS MÚSICAS
        // ----------------------------------------

        musicTracks.forEach((otherTrack) => {

            if (otherTrack === track) return;

            const otherAudio =
                otherTrack.querySelector("audio");

            const otherButton =
                otherTrack.querySelector(".music-play");


            if (otherAudio && !otherAudio.paused) {

                otherAudio.pause();

                otherTrack.classList.remove(
                    "beat-active"
                );

                if (otherButton) {

                    otherButton.textContent = "▶";

                }

            }

        });


        // ----------------------------------------
        // PLAY
        // ----------------------------------------

        if (audio.paused) {

            audio.play();

            playButton.textContent = "Ⅱ";

            track.classList.add("beat-active");

            currentlyPlaying = track;

        }


        // ----------------------------------------
        // PAUSE
        // ----------------------------------------

        else {

            audio.pause();

            playButton.textContent = "▶";

            track.classList.remove(
                "beat-active"
            );

            currentlyPlaying = null;

        }

    });


    // ========================================
    // ATUALIZAÇÃO DO TEMPO
    // ========================================

    audio.addEventListener("timeupdate", () => {

        if (currentTimeElement) {

            currentTimeElement.textContent =
                formatTime(audio.currentTime);

        }

        if (
            progressBar &&
            !progressBar.matches(":active")
        ) {

            progressBar.value =
                audio.currentTime;

        }

    });


    // ========================================
    // BARRA DE PROGRESSO
    // ========================================

    if (progressBar) {

        progressBar.addEventListener("input", () => {

            audio.currentTime =
                Number(progressBar.value);

        });

    }


    // ========================================
    // QUANDO TERMINA
    // ========================================

    audio.addEventListener("ended", () => {

        playButton.textContent = "▶";

        track.classList.remove(
            "beat-active"
        );

        currentlyPlaying = null;


        if (progressBar) {

            progressBar.value = 0;

        }


        if (currentTimeElement) {

            currentTimeElement.textContent =
                "0:00";

        }

    });

});
