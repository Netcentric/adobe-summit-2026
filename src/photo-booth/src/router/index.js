import { createRouter, createWebHistory } from "vue-router";
import { useDemoStore } from "../stores/demoStore";

import Welcome from "../views/Welcome.vue";
import Camera from "../views/Camera.vue";
import Preview from "../views/Preview.vue";
import SelectCircuit from "../views/SelectCircuit.vue";
import SelectEra from "../views/SelectEra.vue";
import Generating from "../views/Generating.vue";
import Result from "../views/Result.vue";
import VideoGenerating from "../views/VideoGenerating.vue";
import VideoResult from "../views/VideoResult.vue";
import DeliveryOptions from "../views/DeliveryOptions.vue";
import PrintSetup from "../views/PrintSetup.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: "/", name: "welcome", component: Welcome },
        { path: "/camera", name: "camera", component: Camera },
        { path: "/preview", name: "preview", component: Preview },
        { path: "/select-circuit", name: "select-circuit", component: SelectCircuit },
        { path: "/select-era", name: "select-era", component: SelectEra },
        { path: "/generating", name: "generating", component: Generating },
        { path: "/result", name: "result", component: Result },
        {
            path: "/video-generating",
            name: "video-generating",
            component: VideoGenerating,
        },
        {
            path: "/video-result",
            name: "video-result",
            component: VideoResult,
        },
        {
            path: "/delivery-options",
            name: "delivery-options",
            component: DeliveryOptions,
        },
        {
            path: "/print-setup",
            name: "print-setup",
            component: PrintSetup,
        },
    ],
});

/**
 * GLOBAL ROUTE GUARD
 */
router.beforeEach((to) => {
    const demo = useDemoStore();

    // ------------------------------------------------
    // 🚪 WELCOME (consent)
    // ------------------------------------------------
    if (to.name !== "welcome" && !demo.consentAccepted) {
        return { name: "welcome" };
    }

    // ------------------------------------------------
    // 📸 PREVIEW
    // ------------------------------------------------
    if (to.name === "preview" && !demo.photoBlob) {
        return { name: "camera" };
    }

    // ------------------------------------------------
    // 🏎️ SELECT CIRCUIT (needs photo)
    // ------------------------------------------------
    if (to.name === "select-circuit" && !demo.photoBlob) {
        return { name: "camera" };
    }

    // ------------------------------------------------
    // 🕰️ SELECT ERA (needs photo + region)
    // ------------------------------------------------
    if (to.name === "select-era" && (!demo.photoBlob || !demo.region)) {
        return { name: "select-circuit" };
    }

    // ------------------------------------------------
    // 🏁 RESULT
    // ------------------------------------------------
    if (to.name === "result" && !demo.generated) {
        return { name: "camera" };
    }

    // ------------------------------------------------
    // 🏁 VIDEO GENERATING
    // ------------------------------------------------
    if (to.name === "video-generating" && (!demo.generatedImage || !demo.generatedImageUrl)) {
        return { name: "result" };
    }

    // 🎬 VIDEO RESULT
    if (to.name === "video-result" && demo.videoStatus !== "ready") {
        return { name: "video-generating" };
    }

    return true;
});

export default router;
