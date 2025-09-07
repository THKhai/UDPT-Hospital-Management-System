// services/userService.ts
import { authService } from './authservice.ts';

// ===== BƯỚC 2.1: INTERFACE USER =====
export interface User {
    id: number;
    name: string;
    phone: string;
    user_id: number;
    email: string;
}

// ===== BƯỚC 2.2: USER SERVICE CLASS =====
class UserService {
    private readonly API_URL = 'http://localhost:8000';

    /**
     * BƯỚC 2.3: Gọi API lấy thông tin user theo username
     */
    async getUserByUsername(username: string): Promise<User | null> {
        try {
            console.log(`📡 Đang gọi API lấy thông tin user: ${username}`);

            // Lấy token để gửi kèm request
            const token = authService.getToken();
            if (!token) {
                throw new Error('Không có token');
            }

            const response = await fetch(`${this.API_URL}/patients/patient_profile?username=${username}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`Lỗi ${response.status}: ${response.statusText}`);
            }

            const userData: User = await response.json();
            console.log('✅ Đã lấy được thông tin user:', userData);

            // Lưu vào localStorage để dùng offline
            localStorage.setItem('user_data', JSON.stringify(userData));

            return userData;

        } catch (error: any) {
            console.error('❌ Lỗi khi lấy thông tin user:', error.message);

            // Thử lấy từ localStorage nếu có
            const cached = localStorage.getItem('user_data');
            if (cached) {
                console.log('📦 Sử dụng dữ liệu user từ cache');
                return JSON.parse(cached);
            }

            return null;
        }
    }

    /**
     * BƯỚC 2.4: Lấy thông tin user hiện tại
     * (Lấy username từ token rồi gọi API)
     */
    async getCurrentUser(): Promise<User | null> {
        // Lấy username đã lưu
        const username = authService.getStoredUsername();

        if (!username) {
            console.log('❌ Không tìm thấy username');
            return null;
        }

        // Gọi API lấy thông tin
        return await this.getUserByUsername(username);
    }

    /**
     * BƯỚC 2.5: Xóa cache user
     */
    clearUserCache(): void {
        localStorage.removeItem('user_data');
    }
}

// Export instance duy nhất
export const userService = new UserService();