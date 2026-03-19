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
    const imageSelection = Array.isArray(data.imageSelection)
        ? data.imageSelection
        : [];

    const photoUrls = imageSelection
        .map((item) => item?.url)
        .filter(Boolean);

    const approvalUrls = imageSelection
        .map((item) => item?.approvalUrl)
        .filter(Boolean);

    const videoUrl =
        data.video ||
        data.videoUrl ||
        data.assets?.video ||
        null;

    const landingPage =
        data.landingPage ||
        null;

    const badge = data.badge || {};

    const personName =
        badge.name ||
        [badge.first_name, badge.last_name].filter(Boolean).join(" ").trim() ||
        data.personName ||
        data.name ||
        data.badgeName ||
        null;

    return {
        raw: data,
        badge,
        personName: personName || null,
        photoUrls,
        approvalUrls,
        imageSelection,
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