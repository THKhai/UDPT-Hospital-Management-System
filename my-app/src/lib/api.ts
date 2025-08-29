import { getAccessToken, getRefreshToken, saveTokens, clearTokens, isJwtExpired } from "./auth";

const API_URL = "http://localhost:8000";

async function refreshAccessToken(): Promise<string | null> {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return null;

    const res = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
        credentials: "include", // nếu server dùng cookie httpOnly cho refresh
    });

    if (!res.ok) return null;

    const data = (await res.json()) as { accessToken?: string; refreshToken?: string };
    if (!data.accessToken) return null;

    saveTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken ?? refreshToken });
    return data.accessToken;
}

export async function apiFetch(input: RequestInfo | URL, init: RequestInit = {}) {
    // Gắn Authorization nếu có token
    const headers = new Headers(init.headers || {});
    const currentAccess = getAccessToken();
    if (currentAccess && !headers.has("Authorization")) {
        headers.set("Authorization", `Bearer ${currentAccess}`);
    }
    const firstReq = await fetch(input, { ...init, headers });

    // Nếu 401 hoặc token hết hạn, thử refresh một lần rồi gọi lại
    if (firstReq.status === 401 || isJwtExpired(currentAccess)) {
        const newAccess = await refreshAccessToken();
        if (!newAccess) {
            clearTokens();
            return firstReq; // trả về 401 để UI xử lý logout/điều hướng
        }

        const retryHeaders = new Headers(init.headers || {});
        retryHeaders.set("Authorization", `Bearer ${newAccess}`);
        return fetch(input, { ...init, headers: retryHeaders });
    }

    return firstReq;
}

async function login(username: string, password: string) {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include", // bật nếu server dùng cookie kèm refresh
    });

    if (!res.ok) {
        const msg = await (async () => {
            try {
                const j = await res.json();
                return j.message || j.error || "Đăng nhập thất bại";
            } catch {
                return "Đăng nhập thất bại";
            }
        })();
        throw new Error(msg);
    }

    const data = (await res.json()) as { accessToken: string; refreshToken?: string; user?: unknown };
    if (!data.accessToken) throw new Error("Không nhận được accessToken.");

    saveTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
    return data;
}
