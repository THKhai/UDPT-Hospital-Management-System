import type {JWTPayload, LoginResponse, LoginRequest, RegisterRequest} from '../types/auth.ts';
class AuthService {
    // API config
    private readonly API_URL = 'http://localhost:8000';

    /**
     * BƯỚC 1.1: Decode JWT Token
     * Chuyển token thành object để đọc thông tin
     */
    decodeToken(token: string): JWTPayload | null {
        try {
            // JWT có 3 phần: header.payload.signature
            const parts = token.split('.');
            if (parts.length !== 3) {
                console.error('Token không đúng format JWT');
                return null;
            }

            // Lấy phần payload (phần giữa)
            const payload = parts[1];

            // Decode base64
            const decoded = atob(payload);

            // Parse JSON
            const data = JSON.parse(decoded);

            console.log('✅ Decoded token:', data);
            return data;
        } catch (error) {
            console.error('❌ Lỗi decode token:', error);
            return null;
        }
    }

    /**
     * BƯỚC 1.2: Login và lưu token
     */
    async login(credentials: LoginRequest): Promise<{ success: boolean; username?: string; error?: string }> {
        try {
            console.log('🔐 Đang đăng nhập với username:', credentials.username);

            // Gọi API login
            const response = await fetch(`${this.API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            // Kiểm tra response
            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.detail || 'Đăng nhập thất bại');
            }

            // Lấy data từ response
            const data: LoginResponse = await response.json();
            console.log('📦 Response từ server:', data);

            // Kiểm tra có token không
            if (!data.access_token) {
                throw new Error('Không nhận được token từ server');
            }

            // BƯỚC 1.3: Decode token để lấy username
            const payload = this.decodeToken(data.access_token);
            if (!payload) {
                throw new Error('Token không hợp lệ');
            }

            // Lấy username từ token (field 'sub')
            const username = payload.sub;
            console.log('👤 Username từ token:', username);

            // BƯỚC 1.4: Lưu token và username vào localStorage
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('username', username);

            console.log('✅ Đăng nhập thành công!');
            console.log('💾 Đã lưu token và username vào localStorage');

            return {
                success: true,
                username: username
            };

        } catch (error: any) {
            console.error('❌ Lỗi đăng nhập:', error.message);
            return {
                success: false,
                error: error.message
            };


        }
    }
    async register(credentials: RegisterRequest): Promise<{ success: boolean; username?: string; error?: string }> {
        try {
            const response = await fetch(`${this.API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.detail || error.message || 'Đăng ký thất bại');
            }

            // Backend có thể trả message hoặc user; không nhất thiết trả token
            // Nếu backend trả token và bạn muốn auto-login bằng token, có thể xử lý tại đây.
            return { success: true, username: credentials.username };
        } catch (e: any) {
            return { success: false, error: e?.message || 'Đăng ký thất bại' };
        }
    }

    /**
     * BƯỚC 1.5: Lấy token từ localStorage
     */
    getToken(): string | null {
        return localStorage.getItem('access_token');
    }

    /**
     * BƯỚC 1.6: Lấy username đã lưu
     */
    getStoredUsername(): string | null {
        return localStorage.getItem('username');
    }

    /**
     * BƯỚC 1.7: Kiểm tra token còn hạn không
     */
    isTokenExpired(): boolean {
        const token = this.getToken();
        if (!token) return true;

        const payload = this.decodeToken(token);
        if (!payload) return true;

        // So sánh với thời gian hiện tại (tính bằng giây)
        const currentTime = Math.floor(Date.now() / 1000);
        return payload.exp <= currentTime;
    }

    /**
     * BƯỚC 1.8: Lấy thời gian còn lại của token (giây)
     */
    getTokenRemainingTime(): number {
        const token = this.getToken();
        if (!token) return 0;

        const payload = this.decodeToken(token);
        if (!payload) return 0;

        const currentTime = Math.floor(Date.now() / 1000);
        const remaining = payload.exp - currentTime;

        return remaining > 0 ? remaining : 0;
    }

    /**
     * BƯỚC 1.9: Xóa token và thông tin user
     */
    logout(): void {
        console.log('🚪 Đăng xuất...');
        localStorage.removeItem('access_token');
        localStorage.removeItem('username');
        localStorage.removeItem('user_data');
        console.log('✅ Đã xóa toàn bộ thông tin');
    }
}

// Export instance duy nhất
export const authService = new AuthService();