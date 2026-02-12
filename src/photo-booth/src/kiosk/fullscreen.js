let entered = false;

export function enableFullscreenOnce() {
    if (entered) return;

    entered = true;

    const el = document.documentElement;

    if (el.requestFullscreen) el.requestFullscreen();
}
