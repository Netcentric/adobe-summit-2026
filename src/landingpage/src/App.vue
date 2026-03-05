<script setup>
const handleDownload = (type) => {
    console.info(`Download ${type} clicked`)
}
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
                    <video class="video-element" src="/adobe-background.mp4" autoplay muted loop playsinline></video>
                    <div class="overlay-actions">
                        <button class="btn primary" @click="handleDownload('video')">Download Video</button>
                        <button class="btn secondary" @click="handleDownload('photo')">Download Image</button>
                    </div>
                </div>

                <aside class="side-panel">
                    <h2 class="side-title">Download your personal racing moment!</h2>
                    <div class="cta-row">
                        <button class="btn primary" @click="handleDownload('video')">Download Video</button>
                        <button class="btn secondary" @click="handleDownload('photo')">Download Image</button>
                    </div>
                    <div class="panel-footer">
                        <p>Share this</p>
                        <div class="social">
                            <a href="https://www.linkedin.com" aria-label="LinkedIn"  target="_blank"
                                rel="noopener noreferrer">
                                <img src="/LinkedIn.svg" alt="LinkedIn logo" />
                            </a>
                            <a href="https://www.facebook.com" aria-label="Facebook"  target="_blank"
                                rel="noopener noreferrer">
                                <img src="/Facebook.svg" alt="Facebook logo" />
                            </a>
                            <a href="https://www.instagram.com" aria-label="Instagram" 
                                target="_blank" rel="noopener noreferrer">
                                <img src="/Instagram.svg" alt="Instagram logo" />
                            </a>
                            <a href="https://x.com" aria-label="X"  target="_blank"
                                rel="noopener noreferrer">
                                <img src="/X.svg" alt="X logo" />
                            </a>
                        </div>
                    </div>
                </aside>
            </div>
        </main>

        <!-- Mobile footer (desktop hides via CSS) -->
        <footer class="footer-mobile">
            <p>Share this</p>
            <div class="social">
                <a href="https://www.linkedin.com" aria-label="LinkedIn"  target="_blank"
                    rel="noopener noreferrer">
                    <img src="/LinkedIn-blue.svg" alt="LinkedIn logo" />
                </a>
                <a href="https://www.facebook.com" aria-label="Facebook"  target="_blank"
                    rel="noopener noreferrer">
                    <img src="/Facebook-blue.svg" alt="Facebook logo" />
                </a>
                <a href="https://www.instagram.com" aria-label="Instagram"  target="_blank"
                    rel="noopener noreferrer">
                    <img src="/Instagram-blue.svg" alt="Instagram logo" />
                </a>
                <a href="https://x.com" aria-label="X"  target="_blank" rel="noopener noreferrer">
                    <img src="/X-blue.svg" alt="X logo" />
                </a>
            </div>
        </footer>
    </div>
</template>

<style scoped>
.page {
    width: 100%;
    min-height: 100vh;
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
    min-height: 100vh;
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
    align-items: center;
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
    .hero-grid {
        min-height: auto;
    }

    .video-frame {
        height: calc(100vh - 220px);
        max-height: calc(100vh - 180px);
        min-height: 480px;
    }

    .footer-mobile {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        flex-wrap: wrap;
        margin-top: 24px;
    }

    .btn {
        min-width: 250px;
    }

    /* Hide side panel on mobile, as per design */
    .video-frame {
        position: relative;
        /* already set, keep it */
    }

    /* Bottom-only gradient overlay */
    .video-frame::after {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;

        /* how tall the fade is */
        height: 305px;

        /* rgba(0,0,72,0) -> rgba(0,0,72,1) */
        background: linear-gradient(to bottom,
                rgba(0, 0, 72, 0),
                rgba(0, 0, 72, 1));

        pointer-events: none;
        z-index: 1;
    }

    /* Make sure buttons stay above the overlay */
    .overlay-actions {
        z-index: 2;
        /* you already have this */
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
