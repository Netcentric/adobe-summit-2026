import { watch } from "vue";
import { useDemoStore } from "../stores/demoStore";

/**
 * Keeps Pinia store <-> Vue Router in sync
 * - store.status changes => navigate
 * - route changes => update store.status (so state matches URL)
 */
export function syncDemoStoreWithRouter(router, pinia) {
    const demo = useDemoStore(pinia);

    // map status -> route name
    const statusToRoute = {
        welcome: "welcome",
        camera: "camera",
        preview: "preview",
        approval: "approval",
        generating: "generating",
        result: "result",
    };

    // --- Store -> Router ---
    watch(
        () => demo.status,
        (newStatus) => {
            const targetName = statusToRoute[newStatus] || "welcome";
            if (router.currentRoute.value.name !== targetName) {
                router.push({ name: targetName }).catch(() => {});
            }
        },
        { immediate: true },
    );

    // --- Router -> Store ---
    router.afterEach((to) => {
        const routeStatus = to.meta?.status;
        if (routeStatus && demo.status !== routeStatus) {
            demo.status = routeStatus;
        }
    });
}
