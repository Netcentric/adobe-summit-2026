<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { useDemoStore } from "../stores/demoStore";

const router = useRouter();
const demo = useDemoStore();

const telemetry = [
  "Locking driver identity",
  "Initializing cinematic motion",
  "Calibrating era-specific details",
  "Rendering paddock environment",
  "Applying broadcast-grade motion",
  "Finalizing driver introduction"
];

const currentStep = ref(0);
const progress = ref(0);

let stepTimer = null;
let pollTimer = null;

onMounted(async () => {
  try {
    // --------------------
    // UX TELEMETRY (visual only)
    // --------------------
    stepTimer = setInterval(() => {
      if (currentStep.value < telemetry.length - 1) {
        currentStep.value++;
        progress.value = Math.min(
          progress.value + Math.floor(100 / telemetry.length),
          95
        );
      }
    }, 700);

    let jobId = demo.videoJobId;

    // --------------------
    // START VIDEO JOB (only once)
    // --------------------
    if (!jobId) {
      const startRes = await fetch("/api/grok-generate-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: demo.generatedImageUrl,
          era: demo.era,
          region: demo.region
        })
      });

      const startData = await startRes.json();

      if (!startRes.ok || !startData.jobId) {
        throw new Error(startData?.error || "Failed to start video generation");
      }

      jobId = startData.jobId;
      demo.setVideoJob(jobId); // MUST set status = "pending"
    }

    // --------------------
    // POLL VIDEO STATUS
    // --------------------
    pollTimer = setInterval(async () => {
      const statusRes = await fetch(
        `/api/grok-video-status?jobId=${jobId}`
      );

      const statusData = await statusRes.json();

      // ⏳ still rendering
      if (statusData.status === "pending") {
        return;
      }

      // ❌ failed
      if (statusData.status === "failed") {
        clearInterval(pollTimer);
        clearInterval(stepTimer);

        demo.setVideoFailed();
        alert("Video generation failed.");
        router.push("/result");
        return;
      }

      // ✅ completed
      if (statusData.status === "completed") {
        clearInterval(pollTimer);
        clearInterval(stepTimer);

        progress.value = 100;
        demo.setGeneratedVideo(statusData.videoUrl);

        setTimeout(() => {
          router.push("/video-result");
        }, 600);
      }
    }, 30_000); // ✅ poll every 30 seconds

  } catch (err) {
    console.error("❌ Video generation error:", err);

    clearInterval(stepTimer);
    clearInterval(pollTimer);

    demo.setVideoFailed();
    alert("Video generation failed. Returning to photo result.");
    router.push("/result");
  }
});

onBeforeUnmount(() => {
  clearInterval(stepTimer);
  clearInterval(pollTimer);
});
</script>