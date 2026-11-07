(() => {
  const originalGreater = window.yyfgreater;
  let transitionStarted = false;

  if (typeof originalGreater !== 'function') return;

  const originalDrawText = window._08;
  if (typeof originalDrawText === 'function') {
    window._08 = function (x, y) {
      // Remove somente o texto de escala desenhado no canto superior esquerdo.
      if (Number(x) === 15 && Number(y) === 15) return;
      return originalDrawText.apply(this, arguments);
    };
  }

  // The exported GameMaker condition is yyfgreater(yscale, 3.4).
  window.yyfgreater = function (value, limit) {
    const result = originalGreater.apply(this, arguments);

    if (!transitionStarted && Number(limit) === 3.4 && result) {
      transitionStarted = true;

      // The original game code immediately stops the music and plays snd_item.
      // This file only waits for that sound, then moves to the egg page.
      setTimeout(() => {
        window.location.href = '../ENCRIPTED-013/ENCRIPT/ENCRIPTED.html';
      }, 1800);
    }

    return result;
  };
})();
