<template>
    <div class="app-shell">
        <AppHeader />
        <router-view />

        <div v-if="showTrigger" class="admin-trigger" @click="openDialog" />

        <Teleport to="body">
            <div v-if="dialogOpen" class="admin-overlay" @click.self="dialogOpen = false">
                <div class="admin-dialog">
                    <div class="admin-dialog-header">
                        <h2 class="admin-dialog-title">Past Runs</h2>
                        <button class="admin-close" @click="dialogOpen = false">×</button>
                    </div>
                    <div class="admin-dialog-body">
                        <p v-if="loading" class="admin-status">Loading…</p>
                        <p v-else-if="fetchError" class="admin-status admin-status--error">{{ fetchError }}</p>
                        <template v-else>
                            <p v-if="!runs.length" class="admin-status">No runs found.</p>
                            <ul v-else class="run-list">
                                <li
                                    v-for="run in runs"
                                    :key="run.session"
                                    class="run-item"
                                    @click="selectRun(run)"
                                >
                                    <img :src="run.image" class="run-thumb" loading="lazy" />
                                    <div class="run-info">
                                        <div class="run-era">
                                            {{ run.context.promptParameters.eraTitle.trim() }}
                                            <span class="run-years">({{ run.context.promptParameters.eraYears }})</span>
                                        </div>
                                        <div class="run-circuit">{{ run.context.promptParameters.circuitName }}</div>
                                        <div class="run-location">{{ run.context.promptParameters.circuitLocation }}</div>
                                        <div class="run-date">{{ formatDate(run.created) }}</div>
                                    </div>
                                </li>
                            </ul>
                        </template>
                    </div>
                </div>
            </div>
        </Teleport>
    </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import AppHeader from "./components/AppHeader.vue";
import { fetchLatestRuns } from "./lib/photoboothApi";
import { useDemoStore } from "./stores/demoStore";

const router = useRouter();
const demo = useDemoStore();

const route = useRoute();
const hasToken = computed(() => !!localStorage.getItem("token"));
const showTrigger = computed(() => hasToken.value && route.name === "welcome");
const dialogOpen = ref(false);
const loading = ref(false);
const fetchError = ref(null);
const runs = ref([]);

function formatDate(ts) {
    return new Date(ts).toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

async function openDialog() {
    dialogOpen.value = true;
    loading.value = true;
    fetchError.value = null;
    runs.value = [];
    try {
        const data = await fetchLatestRuns();
        runs.value = Array.isArray(data) ? data : [];
    } catch (e) {
        fetchError.value = e.message || "Failed to load runs";
    } finally {
        loading.value = false;
    }
}

function selectRun(run) {
    demo.loadFromPastRun(run);
    dialogOpen.value = false;
    router.push("/print-setup");
}
</script>

<style lang="scss">
.app-shell {
    height: 100%;
    display: flex;
    flex-direction: column;
}

html {
    @include big-screen {
        font-size: 25px;
    }
}

/* ── Admin trigger area ─────────────────────────────── */
.admin-trigger {
    position: fixed;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 40px;
    height: 300px;
    z-index: 500;
    cursor: pointer;
    background: transparent;
}

/* ── Dialog overlay ─────────────────────────────────── */
.admin-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.75);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
}

.admin-dialog {
    background: #12121e;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    width: 560px;
    max-width: calc(100vw - 2rem);
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.admin-dialog-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    flex-shrink: 0;
}

.admin-dialog-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: #fff;
    margin: 0;
}

.admin-close {
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.5);
    font-size: 1.5rem;
    line-height: 1;
    cursor: pointer;
    padding: 0;

    &:hover {
        color: #fff;
    }
}

.admin-dialog-body {
    overflow-y: auto;
    flex: 1;
}

/* ── Status messages ────────────────────────────────── */
.admin-status {
    padding: 2rem;
    text-align: center;
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.9rem;
    margin: 0;

    &--error {
        color: #f87171;
    }
}

/* ── Run list ───────────────────────────────────────── */
.run-list {
    list-style: none;
    margin: 0;
    padding: 0;
}

.run-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.875rem 1.5rem;
    cursor: pointer;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    transition: background 0.15s;

    &:last-child {
        border-bottom: none;
    }

    &:hover {
        background: rgba(255, 255, 255, 0.06);
    }
}

.run-thumb {
    width: 64px;
    height: 64px;
    object-fit: cover;
    border-radius: 6px;
    flex-shrink: 0;
    background: #2a2a3a;
}

.run-info {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    min-width: 0;
}

.run-era {
    font-size: 0.9rem;
    font-weight: 600;
    color: #fff;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.run-years {
    font-weight: 400;
    color: rgba(255, 255, 255, 0.5);
}

.run-circuit {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.7);
}

.run-location {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.4);
}

.run-date {
    font-size: 0.7rem;
    color: rgba(255, 255, 255, 0.3);
    margin-top: 0.15rem;
}
</style>
