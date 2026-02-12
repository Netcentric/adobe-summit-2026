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
    approved: false,

    // --------------------
    // VIDEO GENERATION
    // --------------------
    videoJobId: null,
    videoUrl: null,
    videoStatus: "idle", // idle | pending | ready | failed

    // --------------------
    // FLOW STATUS
    // --------------------
    // welcome | camera | preview | approval | generating | result | video-generating | video-result
    status: "welcome"
  }),

  getters: {
    isPhotoTaken: (state) => !!state.photoBlob,
    isSelectionComplete: (state) => !!state.era && !!state.region,
    canGenerate: (state) =>
      !!state.photoBlob &&
      !!state.era &&
      !!state.region &&
      state.approved
  },

  actions: {
    // --------------------
    // FLOW
    // --------------------
    goTo(status) {
      this.status = status;
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
      this.status = "preview";
    },

    resetPhoto() {
      this.photoBlob = null;
      this.photoPreview = null;
      this.generatedImage = null;
      this.era = null;
      this.region = null;
      this.approved = false;
      this.generated = false;
      this.resetVideo();
      this.status = "camera";
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
    // APPROVAL
    // --------------------
    approve() {
      this.approved = true;
      this.status = "generating";
    },

    // --------------------
    // IMAGE GENERATION COMPLETE
    // --------------------
    markGenerated({ image, imageUrl }) {
      this.generatedImage = image;        // base64 → UI
      this.generatedImageUrl = imageUrl;  // ✅ PUBLIC
      this.generated = true;
      this.status = "result";
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
      this.approved = false;
      this.generated = false;
      this.resetVideo();
      this.status = "welcome";
    }
  }
});