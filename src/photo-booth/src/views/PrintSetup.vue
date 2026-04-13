<template>
    <div class="print-screen">
        <!-- BACKGROUND VIDEO -->
        <video class="bg-video" autoplay muted loop playsinline>
            <source src="/agent-animation-bg.mp4" type="video/mp4" />
        </video>

        <div class="print-content">
            <h1 class="title">Take your racing moment <br> with you as a print.</h1>

            <div class="stage">
                <!-- POLAROID -->
                <div class="polaroid">
                    <img :src="demo.selectedPhoto" class="photo" />
                </div>

                <!-- FLOATING FORM -->
                <div class="form-card">
                    <input v-model="name" type="text" placeholder="Your name" />

                    <input v-model="company" type="text" placeholder="Company" />

                    <input v-model="email" type="email" placeholder="Email (optional)" />

                    <Button variant="primary" icon="right" :disabled="!name || !company || !mailFormReady || saving" @click="printImage"
                        class="print-button">
                        Print image
                    </Button>
                </div>
            </div>
            <div class="disclaimer-bar">
                <strong>Review, Approval & Compliance:</strong> You act as the final decision-maker, ensuring the content meets brand and quality standards before it goes live.
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useDemoStore } from "../stores/demoStore";
import Button from "@/components/Button.vue";
import { savePhotoboothLead } from "../lib/photoboothApi";
import { useMailForm } from "../lib/mailForm";

const router = useRouter();
const demo = useDemoStore();

const { mailFormReady, sendMailForm } = useMailForm();

const name = ref("");
const company = ref("");
const email = ref("");
const saving = ref(false);

onMounted(() => {
    if (!demo.selectedPhoto) {
        router.push("/result");
        return;
    }

    console.log("[PhotoBooth Debug] PrintSetup onMounted store snapshot", {
        detectedName: demo.detectedName,
        detectedCompany: demo.detectedCompany,
        detectedEmail: demo.detectedEmail,
        printEmail: demo.printEmail,
    });

    name.value = demo.detectedName || "";
    company.value = demo.detectedCompany || "";
    email.value = demo.printEmail || demo.detectedEmail || "";

    console.log("[PhotoBooth Debug] PrintSetup onMounted form values", {
        name: name.value,
        company: company.value,
        email: email.value,
    });
});

watch(
    () => demo.detectedName,
    (detectedName) => {
        console.log("[PhotoBooth Debug] PrintSetup watch detectedName", {
            detectedName,
            currentInput: name.value,
        });
        if (!name.value && detectedName) {
            name.value = detectedName;
            console.log("[PhotoBooth Debug] PrintSetup name autofilled", name.value);
        }
    }
);

watch(
    () => demo.detectedCompany,
    (detectedCompany) => {
        console.log("[PhotoBooth Debug] PrintSetup watch detectedCompany", {
            detectedCompany,
            currentInput: company.value,
        });
        if (!company.value && detectedCompany) {
            company.value = detectedCompany;
            console.log("[PhotoBooth Debug] PrintSetup company autofilled", company.value);
        }
    }
);

watch(
    () => demo.detectedEmail,
    (detectedEmail) => {
        console.log("[PhotoBooth Debug] PrintSetup watch detectedEmail", {
            detectedEmail,
            currentInput: email.value,
        });
        if (!email.value && detectedEmail) {
            email.value = detectedEmail;
            console.log("[PhotoBooth Debug] PrintSetup email autofilled", email.value);
        }
    }
);

async function printImage() {
    try {
        saving.value = true;

        const trimmedName = name.value.trim();
        const trimmedCompany = company.value.trim();
        const trimmedEmail = email.value.trim();

        demo.printName = trimmedName;
        demo.printCompany = trimmedCompany;
        demo.printEmail = trimmedEmail;

        if (demo.sessionId) {
            const leadPayload = {
                name: trimmedName,
                company: trimmedCompany,
            };

            if (trimmedEmail) {
                leadPayload.mail = trimmedEmail;
            }

            savePhotoboothLead(demo.sessionId, leadPayload);

            // Send to AEP only if email is provided
            if (trimmedEmail) {
                try {
                    const formSubmitId = await sendMailForm({
                        fullName: trimmedName,
                        email: trimmedEmail,
                        company: trimmedCompany,
                        urlImage: demo.selectedPhoto,
                        urlVideo: demo.landingPage,
                    });

                    console.log("[AEP] Event sent", { formSubmitId, email: trimmedEmail });
                } catch (aepError) {
                    console.error("[AEP] Failed to send event", aepError);
                }
            }
        }

        router.push("/printing");
    } catch (err) {
        console.error("Lead save failed:", err);
        router.push("/printing");
    } finally {
        saving.value = false;
    }
}

</script>

<style scoped lang="scss">
.print-screen {
    position: relative;
    min-height: 100vh;
    width: 100%;
    overflow: hidden;
}

/* BACKGROUND VIDEO */
.bg-video {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
}

.print-content {
    position: relative;
    z-index: 2;
    min-height: 100vh;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5rem;
    justify-content: flex-start; /* Leave space for virtual keyboard */
}

.print-button {
    width: max-content;
    align-self: flex-end;
}

.title {
    font-size: 4rem;
    line-height: 1.1em;
    text-align: center;
}

.start-over {
    margin-top: 1rem;
    color: var(--action-link-color);
}

/* Stage wrapper */
.stage {
    position: relative;
    width: 520px;
    display: flex;
    justify-content: center;

    @include big-screen {
        width: 800px
    }
}

/* Polaroid */
.polaroid {
  background: white;
  padding: 17px;
  width: 360px;
  aspect-ratio: 3.5 / 4;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  transform: rotate(5deg);
  position: relative;
  z-index: 1;

  @include big-screen {
    width: 650px;
    padding: 32px;
  }

  & img {
    width: 100%;
    aspect-ratio: 1 / 1;
    object-fit: cover;
    display: block;
    position: relative;
    border-radius: 1px;
    box-shadow: -1px -1px 3px 1px rgba(113, 96, 72, 0.03),
    1px 1px 2px rgba(113, 96, 72, 0.03);
  }
}

.photo {
    width: 100%;
    display: block;
}

/* Floating Form Card */
.form-card {
    position: absolute;
    right: -150px;
    top: 150px;
    width: 260px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    z-index: 2;

    @include big-screen {
        width: 360px;
        right: -250px;
    }
}

.form-card input {
    padding: 0.8rem;
    border-radius: 8px;
    border: none;
    font-size: 1rem;
    border: 1px solid #97999b;

    @include big-screen {
        width: 360px;
    }
}

.form-card input:focus {
    outline: 2px solid rgba(38, 239, 233, 1);
}
</style>
