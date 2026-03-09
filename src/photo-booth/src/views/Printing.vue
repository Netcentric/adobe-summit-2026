<template>
    <div class="printing-screen">
        <h1 class="title">
            Your racing moment is being printed …
        </h1>

        <div class="stage">
            <!-- PRINT AREA (this is what actually prints) -->
            <div class="print-area">

                <!-- POLAROID CARD -->
                <div class="polaroid-card">

                    <!-- HEADER -->
                    <div class="card-header">
                        <img src="/logo.svg" class="logo" />
                        <div class="event-title">Adobe Summit 2026</div>
                    </div>

                    <!-- IMAGE -->
                    <div class="image-wrapper">
                        <img :src="demo.selectedPhoto" class="photo" />
                    </div>

                    <!-- FOOTER -->
                    <div class="card-footer">
                        <div class="meta">
                            <div class="name">{{ demo.printName }}</div>
                            <div class="company">{{ demo.printCompany }}</div>
                        </div>

                        <div class="qr-block">
                            <a v-if="landingPageUrl" :href="landingPageUrl" target="_blank" rel="noopener noreferrer"
                                class="landing-link">
                                Open landing page
                            </a>

                            <img :src="qrCodeUrl" class="qr-code" />
                        </div>
                    </div>

                </div>
            </div>
        </div>

        <!-- START OVER -->
        <div class="start-over">
            <a href="#" @click.prevent="startOver">
                Start over with another photo
            </a>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { useDemoStore } from "../stores/demoStore";

const router = useRouter();
const demo = useDemoStore();

onBeforeUnmount(() => {
    window.onafterprint = null;
});

/* -----------------------------------------
   GUARD
----------------------------------------- */
onMounted(() => {
    if (!demo.selectedPhoto) {
        router.push("/result");
        return;
    }

    // Auto trigger print (works silently with chrome --kiosk-printing)
    setTimeout(() => {
        window.print();
    }, 800);

    // After printing → do nothing for now
    window.onafterprint = () => {
        // intentionally left empty for now
    };
});

/* -----------------------------------------
   LANDING PAGE URL + QR CODE
----------------------------------------- */
const landingBase = computed(() => {
    if (window.location.hostname === "localhost") {
        return "http://localhost:5174";
    }

    return window.location.origin;
});

const landingPageUrl = computed(() => {
    if (!demo.sessionId) return "";

    const url = new URL("/landingpage/index.html", landingBase.value);
    url.searchParams.set("s", demo.sessionId);
    return url.toString();
});

const qrCodeUrl = computed(() => {
    if (!landingPageUrl.value) return "";

    return `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(landingPageUrl.value)}`;
});

/* -----------------------------------------
   START OVER
----------------------------------------- */
function startOver() {
    demo.resetAll();
    router.push("/");
}
</script>

<style scoped>
.printing-screen {
    min-height: 100vh;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
}

/* Title */
.title {
    font-size: 2.4rem;
    text-align: center;
}

/* Stage */
.stage {
    display: flex;
    justify-content: center;
}

/* PRINT AREA */
.print-area {
    display: flex;
    justify-content: center;
}

/* POLAROID CARD */
.polaroid-card {
    background: white;
    width: 360px;
    padding: 1rem 1rem 2.5rem 1rem;
    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.35);
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

/* HEADER */
.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo {
    height: 30px;
}

.event-title {
    font-weight: 600;
    font-size: 0.95rem;
}

/* IMAGE */
.image-wrapper {
    width: 100%;
}

.photo {
    width: 100%;
    display: block;
}

/* FOOTER */
.card-footer {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
}

.meta {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.name {
    font-weight: 600;
}

.company {
    font-size: 0.85rem;
    opacity: 0.7;
}

.qr-code {
    width: 110px;
    height: 110px;
}

.qr-block {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
}

.landing-link {
    font-size: 0.75rem;
    color: var(--action-link-color);
    text-decoration: underline;
    text-align: center;
    word-break: break-word;
    max-width: 120px;
}

/* START OVER */
.start-over {
    margin-top: 3rem;
    color: var(--action-link-color);
}

/* ---------------- PRINT MODE ---------------- */

@media print {

    @page {
        size: 4in 4in;
        margin: 0;
    }

    html,
    body {
        margin: 0 !important;
        padding: 0 !important;
        width: 4in !important;
        height: 4in !important;
        overflow: hidden !important;
    }

    /* Remove everything from layout */
    body>* {
        display: none !important;
    }

    /* Show only print area */
    .print-area {
        display: flex !important;
        position: absolute;
        width: 4in;
        height: 4in;
        top: 0;
        left: 0;
        justify-content: center;
        align-items: center;
    }

    /* DO NOT force height */
    .polaroid-card {
        box-shadow: none;
        width: auto;
        height: auto;
        max-width: 3.8in;
    }
}
</style>