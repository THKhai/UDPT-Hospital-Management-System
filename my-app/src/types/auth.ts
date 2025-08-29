export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    access_token: string;
    token_type: string;
}

export interface JWTPayload {
    sub: string;      // username trong JWT
    role?: string;
}

export interface RegisterRequest {
    username: string
    password: string
    name: string
    email: string
    role: string
}