<template>
    <div class="printing-screen">
        <h1 class="title">
            Your racing moment is being printed …
        </h1>

        <div class="stage">
            <!-- PRINT AREA (this is what actually prints) -->
            <div id="print-badge" class="print-area">

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

                            <img v-if="qrCodeUrl" :src="qrCodeUrl" class="qr-code" />
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
    }, 200);

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
    if (demo.landingPage) {
        return demo.landingPage;
    }

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

.title {
    font-size: 2.4rem;
    text-align: center;
}

.stage {
    display: flex;
    justify-content: center;
    width: 100%;
}

.print-area {
    display: flex;
    justify-content: center;
}

.polaroid-card {
    background: white;
    width: 420px;
    padding: 18px;
    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.35);
    display: flex;
    flex-direction: column;
    gap: 18px;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo {
    height: 34px;
    width: auto;
    display: block;
}

.event-title {
    font-weight: 600;
    font-size: 1.05rem;
    line-height: 1;
    color: #000048;
}

.image-wrapper {
    width: 100%;
    height: 280px;
    overflow: hidden;
    background: #f2f2f2;
}

.photo {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
}

.card-footer {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 18px;
}

.meta {
    display: flex;
    flex-direction: column;
    gap: 10px;
    min-width: 0;
}

.name {
    font-weight: 600;
    font-size: 1.05rem;
    line-height: 1.1;
    color: #000048;
    word-break: break-word;
}

.company {
    font-size: 0.9rem;
    line-height: 1.2;
    color: #2f78c4;
    word-break: break-word;
}

.qr-block {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
}

.landing-link {
    font-size: 0.75rem;
    color: var(--action-link-color);
    text-decoration: underline;
    text-align: center;
    word-break: break-word;
    max-width: 120px;
}

.qr-code {
    width: 110px;
    height: 110px;
    display: block;
}

.start-over {
    margin-top: 1rem;
    color: var(--action-link-color);
}
</style>

<style>
@media print {
  @page {
    size: 4in 4in;
    margin: 0;
  }

  html,
  body,
  #app {
    width: 4in !important;
    height: 4in !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow: hidden !important;
    background: #fff !important;
  }

  body {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  body > * {
    display: none !important;
  }

  #app {
    display: block !important;
  }

  .printing-screen > .title,
  .printing-screen > .start-over,
  header,
  .app-header,
  .app-shell__header {
    display: none !important;
  }

  .printing-screen,
  .stage {
    margin: 0 !important;
    padding: 0 !important;
    min-height: 0 !important;
    height: auto !important;
    display: block !important;
  }

  #print-badge {
    display: block !important;
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 4in !important;
    height: 4in !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow: hidden !important;
    background: #fff !important;
    z-index: 99999 !important;
  }

  #print-badge .polaroid-card {
    box-sizing: border-box !important;
    width: 4in !important;
    height: 4in !important;
    margin: 0 !important;
    padding: 0.28in !important;
    background: #fff !important;
    box-shadow: none !important;
    display: flex !important;
    flex-direction: column !important;
    gap: 0.16in !important;
    overflow: hidden !important;
  }

  #print-badge .card-header {
    height: 0.34in !important;
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
  }

  #print-badge .logo {
    height: 0.4in !important;
    width: auto !important;
    max-width: 1.35in !important;
  }

  #print-badge .event-title {
    font-size: 0.16in !important;
    line-height: 1 !important;
    font-weight: 600 !important;
    color: #000048 !important;
    white-space: nowrap !important;
  }

  #print-badge .image-wrapper {
    width: 100% !important;
    height: 2.22in !important;
    overflow: hidden !important;
    background: #f2f2f2 !important;
  }

  #print-badge .photo {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important;
    display: block !important;
    object-position: center top;
  }

  #print-badge .card-footer {
    flex: 1 !important;
    min-height: 0 !important;
    display: flex !important;
    justify-content: space-between !important;
    align-items: flex-end !important;
    gap: 0.18in !important;
  }

  #print-badge .meta {
    display: flex !important;
    flex-direction: column !important;
    justify-content: flex-end !important;
    gap: 0.08in !important;
    min-width: 0 !important;
    max-width: 2.15in !important;
  }

  #print-badge .name {
    font-size: 0.24in !important;
    line-height: 1.05 !important;
    font-weight: 600 !important;
    color: #000048 !important;
    word-break: break-word !important;
  }

  #print-badge .company {
    font-size: 0.16in !important;
    line-height: 1.15 !important;
    color: #2f78c4 !important;
    word-break: break-word !important;
  }

  #print-badge .qr-block {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: flex-end !important;
    gap: 0 !important;
    flex-shrink: 0 !important;
  }

  #print-badge .landing-link {
    display: none !important;
  }

  #print-badge .qr-code {
    width: 0.6in !important;
    height: 0.6in !important;
    display: block !important;
  }
}
</style>