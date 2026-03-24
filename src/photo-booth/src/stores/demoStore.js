import { defineStore } from "pinia";

export const useDemoStore = defineStore("demo", {
    state: () => ({
        // --------------------
        // IMAGE (SELFIE)
        // --------------------
        photoBlob: null,
        photoPreview: null,

        // --------------------
        // GENERATED IMAGE / SESSION
        // --------------------
        generatedImage: null,
        generatedImageUrl: null,
        generated: false,
        generatedPhotos: [],
        imageSelection: [],
        generatedVideoUrl: null,
        sessionId: null,
        detectedName: null,
        detectedCompany: null,
        detectedEmail: null,
        landingPage: null,

        // --------------------
        // USER SELECTION
        // --------------------
        era: null,
        region: null,
        selectedPhoto: null,
        selectedPhotoFilename: null,

        // --------------------
        // PRINT / EMAIL
        // --------------------
        printName: null,
        printCompany: null,
        printEmail: null,

        // --------------------
        // CONSENT
        // --------------------
        consentAccepted: false,

        // --------------------
        // VIDEO GENERATION
        // --------------------
        videoJobId: null,
        videoUrl: null,
        videoStatus: "idle", // idle | pending | ready | failed
    }),

    getters: {
        isPhotoTaken: (state) => !!state.photoBlob,
        isSelectionComplete: (state) => !!state.era && !!state.region,
        canGenerate: (state) => !!state.photoBlob && !!state.era && !!state.region,
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

            this.generatedImage = null;
            this.generatedImageUrl = null;
            this.generated = false;
            this.generatedPhotos = [];
            this.imageSelection = [];
            this.generatedVideoUrl = null;
            this.sessionId = null;
            this.detectedName = null;
            this.detectedCompany = null;
            this.detectedEmail = null;
            this.landingPage = null;

            this.selectedPhoto = null;
            this.selectedPhotoFilename = null;

            this.printName = null;
            this.printCompany = null;
            this.printEmail = null;

            this.resetVideo();
        },

        resetPhoto() {
            this.photoBlob = null;
            this.photoPreview = null;

            this.generatedImage = null;
            this.generatedImageUrl = null;
            this.generated = false;
            this.generatedPhotos = [];
            this.imageSelection = [];
            this.generatedVideoUrl = null;
            this.sessionId = null;
            this.detectedName = null;
            this.detectedCompany = null;
            this.detectedEmail = null;
            this.landingPage = null;

            this.era = null;
            this.region = null;

            this.selectedPhoto = null;
            this.selectedPhotoFilename = null;

            this.printName = null;
            this.printCompany = null;
            this.printEmail = null;

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

        setImageSelection(items) {
            this.imageSelection = items || [];
        },

        setSelectedPhoto({ url, filename }) {
            this.selectedPhoto = url;
            this.selectedPhotoFilename = filename || null;
            this.generatedImage = url;
            this.generatedImageUrl = url;
        },

        setLandingPage(url) {
            this.landingPage = url || null;
        },

        // --------------------
        // IMAGE GENERATION COMPLETE
        // --------------------
        markGenerated({ image, imageUrl }) {
            this.generatedImage = image;
            this.generatedImageUrl = imageUrl;
            this.generated = true;
        },

        setGeneratedPhotos(photoUrls) {
            this.generatedPhotos = photoUrls || [];
            this.generated = this.generatedPhotos.length > 0;
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
            this.generatedVideoUrl = url;
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
            this.generatedImageUrl = null;
            this.generated = false;
            this.generatedPhotos = [];
            this.imageSelection = [];
            this.generatedVideoUrl = null;
            this.sessionId = null;
            this.detectedName = null;
            this.detectedCompany = null;
            this.detectedEmail = null;
            this.landingPage = null;

            this.era = null;
            this.region = null;

            this.selectedPhoto = null;
            this.selectedPhotoFilename = null;

            this.printName = null;
            this.printCompany = null;
            this.printEmail = null;

            this.consentAccepted = false;

            this.resetVideo();
        },
    },
});
