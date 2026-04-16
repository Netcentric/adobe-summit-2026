const API_BASE = import.meta.env.VITE_API_BASE || "https://api.netcentric.biz";
const API_KEY = import.meta.env.VITE_API_KEY || "x1fG7UmmyT4qL1NePJy4C31awLTi64R83mu7J7pt"; // public

async function parseJson(res) {
    const text = await res.text();

    try {
        return text ? JSON.parse(text) : {};
    } catch {
        return { raw: text };
    }
}

function ensureOk(res, data, label) {
    if (!res.ok) {
        throw new Error(`${label} failed (${res.status}): ${JSON.stringify(data)}`);
    }

    return data;
}

function authHeaders(extra = {}) {
    return {
        "x-api-key": API_KEY,
        ...extra,
    };
}

export async function startPhotobooth(promptParameters) {
    const res = await fetch(`${API_BASE}/photobooth/start`, {
        method: "POST",
        headers: authHeaders({
            "Content-Type": "application/json",
        }),
        body: JSON.stringify({ promptParameters }),
    });

    const data = await parseJson(res);
    return ensureOk(res, data, "start");
}

export async function uploadOriginalPhoto(uploadUrl, blob) {
    const res = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
            "Content-Type": "image/jpeg",
        },
        body: blob,
    });

    if (!res.ok) {
        throw new Error(`upload failed (${res.status})`);
    }

    return true;
}

export async function getPhotoboothStatus(sessionId) {
    const res = await fetch(`${API_BASE}/photobooth/${sessionId}`, {
        method: "GET",
        headers: authHeaders(),
    });

    const data = await parseJson(res);
    return ensureOk(res, data, "status");
}

export async function approvePhotoboothImage(sessionId, filename) {
    const res = await fetch(`${API_BASE}/photobooth/${sessionId}/approve/${filename}`, {
        method: "POST",
        headers: authHeaders(),
    });

    const data = await parseJson(res);
    return ensureOk(res, data, "approve");
}

export async function savePhotoboothLead(sessionId, leadData) {
    const res = await fetch(`${API_BASE}/photobooth/${sessionId}/lead`, {
        method: "POST",
        headers: authHeaders({
            "Content-Type": "application/json",
        }),
        body: JSON.stringify(leadData),
    });

    const data = await parseJson(res);
    return ensureOk(res, data, "lead");
}

export function normalizeStatus(data) {
    const root =
        data?.badge ||
        data?.imageSelection ||
        data?.image ||
        data?.landingPage
            ? data
            : data?.data?.badge || data?.data?.imageSelection || data?.data?.image
                ? data.data
                : data?.result?.badge || data?.result?.imageSelection || data?.result?.image
                    ? data.result
                    : data?.payload?.badge || data?.payload?.imageSelection || data?.payload?.image
                        ? data.payload
                        : data;

    const imageSelection = Array.isArray(root?.imageSelection)
        ? root.imageSelection
        : root?.imageSelection && typeof root.imageSelection === "object"
            ? Object.values(root.imageSelection)
            : [];

    const photoUrls = imageSelection
        .map((item) => item?.url)
        .filter(Boolean);

    const approvalUrls = imageSelection
        .map((item) => item?.approvalUrl)
        .filter(Boolean);

    const videoUrl =
        root?.video ||
        root?.videoUrl ||
        root?.assets?.video ||
        null;

    const imageUrl =
        root?.image ||
        root?.imageUrl ||
        root?.assets?.image ||
        null;

    const landingPage =
        root?.landingPage ||
        null;

    const badge = root?.badge || {};
    const otherText = Array.isArray(root?.other_text)
        ? root.other_text.filter(Boolean).map((value) => String(value).trim()).filter(Boolean)
        : Array.isArray(badge?.other_text)
            ? badge.other_text.filter(Boolean).map((value) => String(value).trim()).filter(Boolean)
        : [];
    const badgeNameFromParts = [badge.first_name, badge.last_name].filter(Boolean).join(" ").trim();
    const nameWithOtherText =
        [root?.name || badge.name, ...otherText].filter(Boolean).join(" ").trim() || null;
    const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
    const emailFromOtherText = otherText.find((value) => emailRegex.test(value)) || null;

    const personName =
        badge.name ||
        badgeNameFromParts ||
        nameWithOtherText ||
        root?.personName ||
        root?.name ||
        root?.badgeName ||
        null;
    const company =
        badge.company ||
        root?.company ||
        null;
    const email =
        badge.email ||
        root?.email ||
        root?.mail ||
        emailFromOtherText ||
        null;

    console.log("[PhotoBooth Debug] normalizeStatus input", data);
    console.log("[PhotoBooth Debug] normalizeStatus root", root);
    console.log("[PhotoBooth Debug] normalizeStatus extracted", {
        personName: personName || null,
        company,
        email,
        otherText,
    });

    return {
        raw: root,
        badge,
        personName: personName || null,
        company,
        email,
        photoUrls,
        approvalUrls,
        imageSelection,
        imageUrl,
        videoUrl,
        landingPage,
    };
}

export function getFilenameFromUrl(url) {
    try {
        const pathname = new URL(url, window.location.origin).pathname;
        return pathname.split("/").pop();
    } catch {
        return url.split("/").pop();
    }
}
