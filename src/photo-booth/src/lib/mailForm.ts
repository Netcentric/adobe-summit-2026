import { ref } from 'vue';

const PROFILE_STREAM_ENDPOINT = "https://dcs.adobedc.net/collection/42eddd0b1126c2de91ac3630f3be31ee8f2c15d26cc93e8a72108c7460c60b7a?syncValidation=true";
const PROFILE_SCHEMA_ID = "https://ns.adobe.com/netcentricgmbh/schemas/80daad627821200e69110ce8df5a01d1aa60ccd01664f4e1";
const PROFILE_DATASET_ID = "69cbacc035fc341f34e01d22";
const PROFILE_FLOW_ID = "dee31e5d-c3af-4a01-96f2-34ca65fc6abd";
const IMS_ORG_ID = "FA907D44536A3C2B0A490D4D@AdobeOrg";

interface ProfileData {
    fullName: String;
    email: String;
    company: String;
    urlImage: String;
    urlVideo: String;
}

export function useMailForm() {
    const mailFormReady = ref(false);

    function waitForAlloy(timeoutMs = 5000) {
        return new Promise((resolve, reject) => {
            const startedAt = Date.now();

            function check() {
                if (window.alloy) {
                    mailFormReady.value = true;
                    resolve(window.alloy);
                    return;
                }

                if (Date.now() - startedAt >= timeoutMs) {
                    reject(new Error("Alloy did not load in time"));
                    return;
                }

                setTimeout(check, 100);
            }

            check();
        });
    }

    waitForAlloy();

    async function sendMailForm(profileData: ProfileData): Promise<String> {
        if (mailFormReady.value !== true) {
            throw new Error('AEP Alloy not ready.');
        }

        const formSubmitId = generateFormSubmitId();

        const eventPromise = sendEvent(profileData, formSubmitId);
        const profilePromise = sendProfileRecord(profileData);

        try {
            const [eventResult, profileResult] = await Promise.all([eventPromise, profilePromise]);

            console.log("Event sent to AEP successfully", {
                formSubmitId: formSubmitId,
                email: profileData.email
            });

            console.log("Profile record sent to AEP successfully", profileResult);
            return formSubmitId;
        } catch(error) {
            throw error;
        }
    }

    return {
        mailFormReady,
        sendMailForm,
    }
}

function generateFormSubmitId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
        return window.crypto.randomUUID();
    }

    return "fsid-" + Date.now() + "-" + Math.random().toString(16).slice(2);
}

function sendProfileRecord(profileData: ProfileData) {
    const payload = {
        header: {
            schemaRef: {
                id: PROFILE_SCHEMA_ID,
                contentType: "application/vnd.adobe.xed-full+json;version=1"
            },
            imsOrgId: IMS_ORG_ID,
            datasetId: PROFILE_DATASET_ID,
            flowId: PROFILE_FLOW_ID
        },
        body: {
            xdmMeta: {
                schemaRef: {
                    id: PROFILE_SCHEMA_ID,
                    contentType: "application/vnd.adobe.xed-full+json;version=1"
                }
            },
            xdmEntity: {
                person: {
                    name: {
                        fullName: profileData.fullName
                    }
                },
                personalEmail: {
                    address: profileData.email
                },
                identityMap: {
                    Email: [
                        {
                            id: profileData.email,
                            primary: true
                        }
                    ]
                },
                _netcentricgmbh: {
                    AS26_Custom: {
                        company: profileData.company,
                        urlImage: profileData.urlImage,
                        urlVideo: profileData.urlVideo
                    }
                }
            }
        }
    };

    return fetch(PROFILE_STREAM_ENDPOINT, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    }).then(async function (response) {
        let result;

        try {
            result = await response.json();
        } catch (parseError) {
            throw new Error("Profile stream response was not valid JSON.");
        }

        if (!response.ok) {
            throw new Error("Profile stream request failed: " + JSON.stringify(result));
        }

        if (!result.synchronousValidation || result.synchronousValidation.status !== "pass") {
            throw new Error("Profile stream validation did not pass: " + JSON.stringify(result));
        }

        return result;
    });
}

function sendEvent (profileData: ProfileData, formSubmitId: String) {
    if (window.alloy === undefined) {
        throw new Error('Form submit not ready to be used.')
    }

    return window.alloy("sendEvent", {
        xdm: {
            eventType: "web.formFilledOut",
            web: {
                webInteraction: {
                    name: "AS26 form submission",
                    type: "other",
                    URL: window.location.href
                }
            },
            person: {
                name: {
                    fullName: profileData.fullName
                }
            },
            personalEmail: {
                address: profileData.email,
                primary: true
            },
            _netcentricgmbh: {
                company: profileData.company,
                urlVideo: profileData.urlVideo,
                urlImage: profileData.urlImage
            },
            identityMap: {
                FormSubmitID: [
                    {
                        id: formSubmitId,
                        authenticatedState: "authenticated",
                        primary: true
                    }
                ],
                Email: [
                    {
                        id: profileData.email,
                        authenticatedState: "authenticated",
                        primary: false
                    }
                ]
            }
        },
        data: {
            customField: "customValue"
        }
    });
}