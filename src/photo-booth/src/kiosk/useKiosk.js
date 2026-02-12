import { useDemoStore } from "../stores/demoStore";
import { useRouter } from "vue-router";

let idleTimer = null;
const IDLE_TIMEOUT = 90_000; // 90 seconds (adjust for booth)

export function useKiosk(router) {
  const demo = useDemoStore();

  function resetIdleTimer() {
    clearTimeout(idleTimer);

    idleTimer = setTimeout(() => {
      console.log("🧹 Kiosk idle timeout → reset");
      demo.resetAll();
      router.push("/");
    }, IDLE_TIMEOUT);
  }

  function startListening() {
    const events = ["click", "touchstart", "mousemove", "keydown"];

    events.forEach((e) =>
      window.addEventListener(e, resetIdleTimer, { passive: true })
    );

    resetIdleTimer();
  }

  function stopListening() {
    clearTimeout(idleTimer);
  }

  return {
    startListening,
    stopListening
  };
}