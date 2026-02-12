import { ref } from "vue";

export function useVideoGeneration() {
    const status = ref("idle"); // idle | pending | succeeded | failed
    const videoUrl = ref(null);
    const error = ref(null);

    let pollInterval = null;

    async function poll(jobId) {
        status.value = "pending";

        pollInterval = setInterval(async () => {
            try {
                const res = await fetch(`/api/video-status?jobId=${jobId}`);
                const data = await res.json();

                if (data.status === "pending") {
                    return;
                }

                if (data.status === "failed") {
                    status.value = "failed";
                    error.value = "Video generation failed";
                    stopPolling();
                }

                if (data.status === "succeeded") {
                    status.value = "succeeded";
                    videoUrl.value = data.videoUrl;
                    stopPolling();
                }
            } catch (e) {
                console.error("Video polling error:", e);
                status.value = "failed";
                error.value = "Polling error";
                stopPolling();
            }
        }, 2000); // every 2 seconds
    }

    function stopPolling() {
        if (pollInterval) {
            clearInterval(pollInterval);
            pollInterval = null;
        }
    }

    return {
        status,
        videoUrl,
        error,
        poll,
        stopPolling,
    };
}
