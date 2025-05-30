const KONAMI_CODE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

export const useKonamiCode = (callback: () => void) => {
  let index = 0;

  const handleKeyDown = (event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    const expectedKey = KONAMI_CODE[index].toLowerCase();

    if (key === expectedKey) {
      index++;

      if (index === KONAMI_CODE.length) {
        callback();
        index = 0;
      }
    } else {
      index = 0;
    }
  };

  return {
    start: () => window.addEventListener('keydown', handleKeyDown),
    stop: () => window.removeEventListener('keydown', handleKeyDown),
  };
}; 