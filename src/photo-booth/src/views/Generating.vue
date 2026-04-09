<template>
    <div class="generating-screen">
        <video class="bg-video" autoplay muted loop playsinline>
            <source src="/adobe-background.mp4" type="video/mp4" />
        </video>

        <div class="content">
            <div class="telemetry-single">
                <h1 class="telemetry-text">
                    I’m creating your <br /> personal racing moment …
                </h1>
            </div>

            <transition name="fade" mode="out-in">
                <p :key="currentHintIndex" class="hint">
                    {{ hint }}
                </p>
            </transition>
        </div>

        <div class="disclaimer-bar">
            <strong>Agile Creation:</strong> AI creates your image instantly – replacing traditional shoots and reducing content production from weeks to seconds.
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { useDemoStore } from "../stores/demoStore";
import { raceConfig } from "../config/raceConfig";
import {
    startPhotobooth,
    uploadOriginalPhoto,
    getPhotoboothStatus,
    normalizeStatus,
} from "../lib/photoboothApi";

const router = useRouter();
const demo = useDemoStore();

const hintMessages = [
    "This takes about 10–15 seconds.",
    "Strapping you into the cockpit … mirrors adjusted.",
    "Helmet on – biometric scan complete.",
    "Calibrating aerodynamics to your profile.",
];

const currentHintIndex = ref(0);
const hint = ref(hintMessages[0]);

function getSlotIndexFromItem(item) {
    const explicitIndex = Number(item?.slotIndex ?? item?.index);
    if (Number.isInteger(explicitIndex) && explicitIndex >= 0 && explicitIndex < 4) {
        return explicitIndex;
    }

    const sources = [item?.url, item?.approvalUrl].filter(Boolean);
    let index = -1;

    for (const source of sources) {
        let pathname = source;
        try {
            pathname = new URL(source, window.location.origin).pathname;
        } catch {
            pathname = source.split("?")[0] || source;
        }

        const filename = pathname.split("/").pop() || "";
        const numberedFilename = filename.match(/^(\d+)(?:\.[^.]*)?$/);
        const trailingNumber = pathname.match(/\/(\d+)(?:\.[^/?.]*)?$/);
        const parsed = Number(numberedFilename?.[1] || trailingNumber?.[1]);

        if (Number.isInteger(parsed) && parsed >= 0 && parsed < 4) {
            index = parsed;
            break;
        }
    }

    return Number.isInteger(index) && index >= 0 && index < 4 ? index : -1;
}

function buildSlotsFromStatus(normalized) {
    const slots = Array.from({ length: 4 }, (_, index) => ({
        type: "loading",
        slotIndex: index,
        url: null,
        approvalUrl: null,
    }));
    const unmatchedItems = [];
    const rawErrorCount = Number(
        normalized.raw?.errors?.image ??
        normalized.raw?.error?.image ??
        0
    );
    const errorCount = Math.max(0, Math.min(4, rawErrorCount));

    (normalized.imageSelection || []).forEach((item) => {
        const slotIndex = getSlotIndexFromItem(item);

        if (slotIndex === -1) {
            unmatchedItems.push(item);
            return;
        }

        slots[slotIndex] = {
            type: "image",
            slotIndex,
            url: item.url || null,
            approvalUrl: item.approvalUrl || null,
        };
    });

    // If backend does not provide usable slot indices, place unmatched images
    // into the first open slots so they don't stay stuck in "Generating...".
    unmatchedItems.forEach((item) => {
        const emptySlot = slots.find((slot) => slot.type === "loading");
        if (!emptySlot) return;

        slots[emptySlot.slotIndex] = {
            type: "image",
            slotIndex: emptySlot.slotIndex,
            url: item.url || null,
            approvalUrl: item.approvalUrl || null,
        };
    });

    const imageCount = slots.filter((slot) => slot.type === "image").length;
    const finalizedCount = Math.min(4, imageCount + Math.max(0, errorCount));

    if (finalizedCount >= 4) {
        let remainingErrors = Math.min(
            4 - imageCount,
            Math.max(0, errorCount)
        );

        slots.forEach((slot, index) => {
            if (slot.type !== "loading" || remainingErrors <= 0) return;

            slots[index] = {
                type: "error",
                slotIndex: index,
                url: null,
                approvalUrl: null,
            };

            remainingErrors -= 1;
        });
    }

    return {
        slots,
        imageCount,
        finalizedCount,
    };
}

let stepTimer = null;
let pollTimer = null;
let hasNavigatedToResult = false;
let keepPollingAfterUnmount = false;

function getEraConfig() {
    return raceConfig.eras.find((item) => item.id === demo.era);
}

function getCircuitConfig() {
    return raceConfig.circuits.find((item) => item.id === demo.region);
}

async function runGenerationFlow() {
    try {
        const era = getEraConfig();
        const circuit = getCircuitConfig();

        if (!demo.photoBlob || !era || !circuit) {
            throw new Error("Missing photo, era, or circuit");
        }

        const startData = await startPhotobooth({
            eraTitle: era.title,
            eraYears: era.years,
            eraDetail: era.promptStyle || era.title,
            circuitName: circuit.name,
            circuitLocation: circuit.country,
        });

        demo.sessionId = startData.session;
        demo.setStopGenerationPolling(false);

        await uploadOriginalPhoto(startData.uploadUrl, demo.photoBlob);

        await waitForPhotos(startData.session);

        if (demo.stopGenerationPolling) {
            clearInterval(stepTimer);
            return;
        }

        clearInterval(stepTimer);

        if (!hasNavigatedToResult) {
            router.push("/result");
        }
    } catch (err) {
        console.error("Generation failed:", err);
        clearInterval(stepTimer);
        clearInterval(pollTimer);

        if (!hasNavigatedToResult) {
            router.push("/preview");
        }
    }
}

async function waitForPhotos(sessionId) {
    return new Promise((resolve, reject) => {
        pollTimer = setInterval(async () => {
            try {
                if (demo.stopGenerationPolling) {
                    clearInterval(pollTimer);
                    keepPollingAfterUnmount = false;
                    resolve();
                    return;
                }

                const statusData = await getPhotoboothStatus(sessionId);
                const normalized = normalizeStatus(statusData);
                console.log("[PhotoBooth Debug] waitForPhotos statusData", statusData);
                console.log("[PhotoBooth Debug] waitForPhotos normalized", normalized);

                if (demo.stopGenerationPolling) {
                    clearInterval(pollTimer);
                    keepPollingAfterUnmount = false;
                    resolve();
                    return;
                }

                if (normalized.personName) {
                    demo.detectedName = normalized.personName;
                    console.log("[PhotoBooth Debug] demo.detectedName set", demo.detectedName);
                }

                if (normalized.company) {
                    demo.detectedCompany = normalized.company;
                    console.log("[PhotoBooth Debug] demo.detectedCompany set", demo.detectedCompany);
                }

                if (normalized.email) {
                    demo.detectedEmail = normalized.email;
                    console.log("[PhotoBooth Debug] demo.detectedEmail set", demo.detectedEmail);
                }

                if (normalized.videoUrl) {
                    demo.setGeneratedVideo(normalized.videoUrl);
                }

                if (normalized.landingPage) {
                    demo.setLandingPage(normalized.landingPage);
                }

                const { slots, imageCount, finalizedCount } = buildSlotsFromStatus(normalized);

                demo.setImageSelection(slots);
                demo.setGeneratedPhotos(
                    slots.map((slot) => (slot.type === "image" ? slot.url : null))
                );

                if (imageCount >= 1 && !hasNavigatedToResult) {
                    hasNavigatedToResult = true;
                    keepPollingAfterUnmount = true;
                    clearInterval(stepTimer);

                    setTimeout(() => {
                        router.push("/result");
                    }, 300);
                }

                if (finalizedCount >= 4) {
                    clearInterval(pollTimer);
                    keepPollingAfterUnmount = false;
                    resolve();
                }
            } catch (err) {
                clearInterval(pollTimer);
                reject(err);
            }
        }, 4000);
    });
}

onMounted(() => {
    stepTimer = setInterval(() => {
        if (currentHintIndex.value < hintMessages.length - 1) {
            currentHintIndex.value++;
            hint.value = hintMessages[currentHintIndex.value];
        }
    }, 3000);

    runGenerationFlow();
});

onBeforeUnmount(() => {
    clearInterval(stepTimer);

    if (!keepPollingAfterUnmount) {
        clearInterval(pollTimer);
    }
});
</script>

<style scoped>
.generating-screen {
    position: relative;
    height: 100vh;
    width: 100%;
    overflow: hidden;
    color: rgba(38, 239, 233, 1);
    display: flex;
    align-items: center;
    justify-content: center;
}

.generating-screen::after {
    content: "";
    position: absolute;
    inset: 0;
    background: var(--brand-dark);
    opacity: 0.5;
    pointer-events: none;
    z-index: 1;
}

.bg-video {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
}

.content {
    position: relative;
    z-index: 2;
    width: 100%;
    padding: 2rem;
    text-align: center;
}

.telemetry-single {
    margin-bottom: 3rem;
}

.telemetry-text {
    color: white;
}

.hint {
    font-size: 2.5rem;
    opacity: 0.8;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
