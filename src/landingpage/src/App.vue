<script setup>
import { computed, onMounted, onBeforeUnmount, ref } from "vue";

const API_BASE = import.meta.env.VITE_API_BASE || "https://api.netcentric.biz";
const API_KEY = import.meta.env.VITE_API_KEY || "x1fG7UmmyT4qL1NePJy4C31awLTi64R83mu7J7pt";

const sessionId = ref(null);
const loading = ref(true);
const error = ref("");
const imageUrl = ref("");
const videoUrl = ref("");
const videoReady = ref(false);
const pollTimer = ref(null);

function getSessionIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("s");
}

function buildHeaders() {
    const headers = {};
    if (API_KEY) {
        headers["x-api-key"] = API_KEY;
    }
    return headers;
}

async function fetchPhotoboothStatus(session) {
    const res = await fetch(`${API_BASE}/photobooth/${session}`, {
        method: "GET",
        headers: buildHeaders(),
    });

    if (!res.ok) {
        throw new Error(`Status failed (${res.status})`);
    }

    return res.json();
}

function normalizeStatus(data) {
    const imageSelection = Array.isArray(data.imageSelection)
        ? data.imageSelection
        : [];

    const imageSelectionUrls = imageSelection
        .map((item) => item?.url)
        .filter(Boolean);

    const resolvedImageUrl =
        data.image ||
        data.imageUrl ||
        data.approvedImageUrl ||
        data.selectedImageUrl ||
        data.finalImageUrl ||
        data.image?.url ||
        data.approvedImage?.url ||
        data.assets?.image ||
        imageSelectionUrls[0] ||
        null;

    const resolvedVideoUrl =
        data.video ||
        data.videoUrl ||
        data.generatedVideoUrl ||
        data.finalVideoUrl ||
        data.video?.url ||
        data.assets?.video ||
        null;

    return {
        imageUrl: resolvedImageUrl,
        videoUrl: resolvedVideoUrl,
        raw: data,
    };
}

async function loadStatus() {
    if (!sessionId.value) {
        error.value = "Missing session id.";
        loading.value = false;
        return;
    }

    try {
        const data = await fetchPhotoboothStatus(sessionId.value);
        const normalized = normalizeStatus(data);

        if (normalized.imageUrl) {
            imageUrl.value = normalized.imageUrl;
        }

        if (normalized.videoUrl && videoUrl.value !== normalized.videoUrl) {
            videoUrl.value = normalized.videoUrl;
            videoReady.value = false;
        }

        loading.value = false;

        if (normalized.videoUrl && pollTimer.value) {
            clearInterval(pollTimer.value);
            pollTimer.value = null;
        }
    } catch (err) {
        console.error("Landing page status error:", err);
        error.value = "Could not load your racing moment.";
        loading.value = false;
    }
}

function startPolling() {
    if (pollTimer.value) return;

    pollTimer.value = setInterval(async () => {
        try {
            const data = await fetchPhotoboothStatus(sessionId.value);
            const normalized = normalizeStatus(data);

            if (normalized.imageUrl && !imageUrl.value) {
                imageUrl.value = normalized.imageUrl;
            }

            if (normalized.videoUrl && videoUrl.value !== normalized.videoUrl) {
                videoUrl.value = normalized.videoUrl;
                videoReady.value = false;
            }

            if (normalized.videoUrl) {
                clearInterval(pollTimer.value);
                pollTimer.value = null;
            }
        } catch (err) {
            console.error("Polling failed:", err);
        }
    }, 3000);
}

const hasImage = computed(() => !!imageUrl.value);
const hasVideo = computed(() => !!videoUrl.value);
const showVideo = computed(() => hasVideo.value && videoReady.value);

const heroTitle = computed(() => {
    if (error.value) return "We could not load your racing moment.";
    if (loading.value) return "Loading your personal racing moment...";
    return "Download your personal racing moment!";
});

function handleDownload(type) {
    const targetUrl = type === "video" ? videoUrl.value : imageUrl.value;

    if (!targetUrl) {
        console.info(`No ${type} available yet`);
        return;
    }

    window.open(targetUrl, "_blank", "noopener,noreferrer");
}

function onVideoReady() {
    videoReady.value = true;
}

function onVideoError() {
    videoReady.value = false;
}

onMounted(async () => {
    sessionId.value = getSessionIdFromUrl();
    await loadStatus();
    startPolling();
});

onBeforeUnmount(() => {
    if (pollTimer.value) {
        clearInterval(pollTimer.value);
        pollTimer.value = null;
    }
});
</script>

<template>
    <div class="page">
        <header class="app-header">
            <div class="left">
                <img src="/logo.svg" alt="Logo" class="logo" />
                <span class="title">Race:me</span>
            </div>
        </header>

        <main class="hero">
            <div class="hero-grid">
                <div class="video-frame">
                    <!-- IMAGE shown until video is actually ready -->
                    <img v-if="hasImage" class="video-element media-layer" :class="{ hidden: showVideo }"
                        :src="imageUrl" alt="Generated racing moment" />

                    <!-- VIDEO only fades in when loaded -->
                    <video v-if="hasVideo" class="video-element media-layer" :class="{ visible: showVideo }"
                        :src="videoUrl" autoplay muted loop playsinline preload="auto" @loadeddata="onVideoReady"
                        @canplay="onVideoReady" @error="onVideoError"></video>

                    <!-- DEFAULT fallback only if no generated image and no video -->
                    <video v-if="!hasImage && !hasVideo" class="video-element" src="/adobe-background.mp4" autoplay
                        muted loop playsinline></video>

                    <div class="overlay-actions">
                        <button class="btn primary" @click="handleDownload('video')" :disabled="!hasVideo">
                            Download Video
                        </button>
                        <button class="btn secondary" @click="handleDownload('photo')" :disabled="!hasImage">
                            Download Image
                        </button>
                    </div>
                </div>

                <aside class="side-panel">
                    <h2 class="side-title">{{ heroTitle }}</h2>

                    <div class="cta-row">
                        <button class="btn primary" @click="handleDownload('video')" :disabled="!hasVideo">
                            Download Video
                        </button>
                        <button class="btn secondary" @click="handleDownload('photo')" :disabled="!hasImage">
                            Download Image
                        </button>
                    </div>

                    <div class="panel-footer">
                        <p>Share this</p>
                        <div class="social">
                            <a href="https://www.linkedin.com" aria-label="LinkedIn" target="_blank"
                                rel="noopener noreferrer">
                                <img src="/LinkedIn.svg" alt="LinkedIn logo" />
                            </a>
                            <a href="https://www.facebook.com" aria-label="Facebook" target="_blank"
                                rel="noopener noreferrer">
                                <img src="/Facebook.svg" alt="Facebook logo" />
                            </a>
                            <a href="https://www.instagram.com" aria-label="Instagram" target="_blank"
                                rel="noopener noreferrer">
                                <img src="/Instagram.svg" alt="Instagram logo" />
                            </a>
                            <a href="https://x.com" aria-label="X" target="_blank" rel="noopener noreferrer">
                                <img src="/X.svg" alt="X logo" />
                            </a>
                        </div>
                    </div>
                </aside>
            </div>
        </main>

        <footer class="footer-mobile">
            <p>Share this</p>
            <div class="social">
                <a href="https://www.linkedin.com" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                    <img src="/LinkedIn-blue.svg" alt="LinkedIn logo" />
                </a>
                <a href="https://www.facebook.com" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                    <img src="/Facebook-blue.svg" alt="Facebook logo" />
                </a>
                <a href="https://www.instagram.com" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                    <img src="/Instagram-blue.svg" alt="Instagram logo" />
                </a>
                <a href="https://x.com" aria-label="X" target="_blank" rel="noopener noreferrer">
                    <img src="/X-blue.svg" alt="X logo" />
                </a>
            </div>
        </footer>
    </div>
</template>

<style scoped>
.page {
    width: 100%;
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
}

.app-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
}

.left {
    display: flex;
    align-items: center;
    gap: 12px;
}

.logo {
    border-right: 1px solid #000048;
    padding-right: 12px;
}

.title {
    font-weight: 700;
    font-size: 1.1rem;
    color: #0f172a;
}

.hero {
    display: flex;
    align-items: stretch;
}

.hero-grid {
    display: grid;
    width: 100%;
    box-sizing: border-box;
    min-height: 100dvh;
}

.video-frame {
    position: relative;
    width: 100%;
    height: 100%;
    max-height: none;
    margin: 0 auto;
    overflow: hidden;
}

.video-element {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.media-layer {
    position: absolute;
    inset: 0;
}

img.media-layer {
    opacity: 1;
    transition: opacity 0.35s ease;
    z-index: 0;
}

img.media-layer.hidden {
    opacity: 0;
}

video.media-layer {
    opacity: 0;
    transition: opacity 0.35s ease;
    z-index: 1;
}

video.media-layer.visible {
    opacity: 1;
}

.overlay-actions {
    position: absolute;
    left: 50%;
    bottom: 24px;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
    z-index: 2;
}

.overlay-actions .button {
    min-width: 220px;
}

.side-panel {
    display: none;
    background: linear-gradient(200deg, #35cacf, #3d54ce, #000000);
    color: white;
    padding: 40px 32px 40px 80px;
    gap: 24px;
    box-shadow: 0 24px 80px rgba(0, 0, 0, 0.35);
}

.eyebrow {
    text-transform: uppercase;
    letter-spacing: 0.18em;
    font-weight: 700;
    font-size: 0.75rem;
    margin: 0;
    color: #cbd5e1;
}

.side-title {
    margin-top: 50px;
    font-size: clamp(2.5rem, 8vw, 6.25rem);
    line-height: 1;
    color: white;
}

.cta-row {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    align-items: center;
    margin-top: 60px;
}

.panel-footer {
    margin-top: auto;
    display: flex;
    align-items: flex-end;
    gap: 20px;
    flex-wrap: wrap;
}

.panel-footer p {
    margin: 0;
    font-weight: 600;
    color: white;
}

.footer-mobile {
    display: none;
}

.social {
    display: flex;
    gap: 20px;
}

.social-pill {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    padding: 8px;
    border-radius: 12px;
    border: 1px solid rgba(15, 23, 42, 0.08);
    background: white;
    box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
    transition: transform 160ms ease, box-shadow 160ms ease;
}

.social-pill img {
    width: 20px;
    height: 20px;
    object-fit: contain;
}

.social-pill:hover {
    transform: translateY(-1px);
    box-shadow: 0 12px 32px rgba(15, 23, 42, 0.1);
}

@media (max-width: 1023px) {
    .page {
        min-height: 100dvh;
    }

    .hero {
        display: block;
    }

    .hero-grid {
        display: block;
        min-height: auto;
    }

    .video-frame {
        position: relative;
        height: auto;
        min-height: auto;
        max-height: none;
        aspect-ratio: 9 / 14;
        overflow: hidden;
    }

    .footer-mobile {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        flex-wrap: wrap;
        margin: 24px 0 32px;
        padding: 0 16px;
    }

    .btn {
        min-width: 250px;
    }

    .video-frame::after {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 305px;
        background: linear-gradient(to bottom,
                rgba(0, 0, 72, 0),
                rgba(0, 0, 72, 1));
        pointer-events: none;
        z-index: 1;
    }

    .overlay-actions {
        z-index: 2;
    }
}

@media (min-width: 1024px) {
    .hero-grid {
        grid-template-columns: 2fr 3fr;
        align-items: stretch;
        min-height: calc(100vh - 64px);
    }

    .side-panel {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .overlay-actions {
        display: none;
    }

    .video-frame {
        margin: 0;
        height: 100%;
    }

    .footer-mobile {
        display: none;
    }
}
</style>