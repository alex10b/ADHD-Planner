export function hapticLight() {
  if ('vibrate' in navigator) {
    navigator.vibrate(50);
  }
}

export function hapticSuccess() {
  if ('vibrate' in navigator) {
    navigator.vibrate([50, 30, 50]);
  }
}
