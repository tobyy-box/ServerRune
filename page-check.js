// ========================================
// PAGE CHECK
// ========================================

(function pageCheck() {

    const path = window.location.pathname;

    const allowedPaths = [
        "/ServerRune/",
        "/ServerRune/devlogs/",
        "/ServerRune/music/",
        "/ServerRune/gallery/",
        "/ServerRune/contact/",
        "/ServerRune/lab/",
        "/ServerRune/...-/",
        "/ServerRune/...-/g/",
        "/ServerRune/dog-check/"
    ];

    const allowed = allowedPaths.some((allowedPath) => {
        return path === allowedPath ||
               path === allowedPath + "index.html";
    });

    if (!allowed) {
        window.location.replace("/ServerRune/dog-check/");
    }

})();