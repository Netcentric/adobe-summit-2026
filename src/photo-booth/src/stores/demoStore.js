import { defineStore } from "pinia";

export const useDemoStore = defineStore("demo", {
    state: () => ({
        // --------------------
        // IMAGE (SELFIE)
        // --------------------
        photoBlob: null,
        photoPreview: null,

        // --------------------
        // GENERATED IMAGE
        // --------------------
        generatedImage: null,
        generatedImageUrl: null,
        generated: false,

        // --------------------
        // SELECTION
        // --------------------
        era: null,
        region: null,

        // --------------------
        // CONSENT
        // --------------------
        consentAccepted: false,

        // --------------------
        videoJobId: null,
        videoUrl: null,
        videoStatus: "idle", // idle | pending | ready | failed
    }),

    getters: {
        isPhotoTaken: (state) => !!state.photoBlob,
        isSelectionComplete: (state) => !!state.era && !!state.region,
        canGenerate: (state) =>
            !!state.photoBlob && !!state.era && !!state.region,
    },

    actions: {
        acceptConsent() {
            this.consentAccepted = true;
        },
        // --------------------
        // PHOTO
        // --------------------
        setPhoto({ blob, preview }) {
            this.photoBlob = blob;
            this.photoPreview = preview;
            this.generated = false;
            this.generatedImage = null;
            this.resetVideo();
        },

        resetPhoto() {
            this.photoBlob = null;
            this.photoPreview = null;
            this.generatedImage = null;
            this.era = null;
            this.region = null;
            this.generated = false;
            this.resetVideo();
        },

        // --------------------
        // SELECTION
        // --------------------
        setEra(era) {
            this.era = era;
        },

        setRegion(region) {
            this.region = region;
        },

        // --------------------
        // IMAGE GENERATION COMPLETE
        // --------------------
        markGenerated({ image, imageUrl }) {
            this.generatedImage = image; // base64 → UI
            this.generatedImageUrl = imageUrl; // ✅ PUBLIC
            this.generated = true;
        },

        // --------------------
        // VIDEO GENERATION
        // --------------------
        setVideoJob(jobId) {
            this.videoJobId = jobId;
            this.videoStatus = "pending";
        },

        setGeneratedVideo(url) {
            this.videoUrl = url;
            this.videoStatus = "ready";
        },

        setVideoFailed() {
            this.videoStatus = "failed";
        },

        resetVideo() {
            this.videoJobId = null;
            this.videoUrl = null;
            this.videoStatus = "idle";
        },

        // --------------------
        // FINAL RESET
        // --------------------
        resetAll() {
            this.photoBlob = null;
            this.photoPreview = null;
            this.generatedImage = null;
            this.era = null;
            this.region = null;
            this.generated = false;
            this.consentAccepted = false;
            this.resetVideo();
        },
    },
});
