export type Tokens = { accessToken: string; refreshToken?: string };

const ACCESS_KEY = "accessToken";
const REFRESH_KEY = "refreshToken";

export function saveTokens(tokens: Tokens) {
    localStorage.setItem(ACCESS_KEY, tokens.accessToken);
    if (tokens.refreshToken) localStorage.setItem(REFRESH_KEY, tokens.refreshToken);
}

export function getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_KEY);
}

export function clearTokens() {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
}

export function getAuthHeader() {
    const token = getAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}

export function isJwtExpired(token?: string | null): boolean {
    if (!token) return true;
    try {
        const [, payload] = token.split(".");
        const json = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
        const expSec = json.exp as number | undefined;
        if (!expSec) return false; // không có exp thì coi như không hết hạn (tùy backend)
        const nowSec = Math.floor(Date.now() / 1000);
        return nowSec >= expSec;
    } catch {
        return true;
    }
}