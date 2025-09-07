// contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../service/authservice.ts';
import { userService } from '../service/userservice.ts';
import type { LoginRequest } from '../types/auth.ts';
import type { User } from '../service/userservice.ts';
// ===== BƯỚC 3.1: INTERFACE CONTEXT =====
interface AuthContextType {
    // State
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    isAuthenticated: boolean;
    isLoading: boolean;
    remainingTime: number; // Thời gian còn lại (giây)
    role: string | null;
    setRole: React.Dispatch<React.SetStateAction<string | null>>;
    username: string;

    // Actions
    login: (credentials: LoginRequest) => Promise<boolean>;
    logout: () => void;
}

// ===== BƯỚC 3.2: TẠO CONTEXT =====
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ===== BƯỚC 3.3: PROVIDER COMPONENT =====
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const navigate = useNavigate();

    // State
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [remainingTime, setRemainingTime] = useState(0);
    const [role,setRole] = useState<string | null>(null);
    const [username, setUsername] = useState<string>('');
    /**
     * BƯỚC 3.4: Hàm đăng nhập
     */
    const login = async (credentials: LoginRequest): Promise<boolean> => {
        setIsLoading(true);

        try {
            // Gọi authService để login
            const result = await authService.login(credentials);

            if (!result.success) {
                alert(result.error || 'Đăng nhập thất bại');
                return false;
            }
            setRole(result.role?.toString() || 'unknow');
            setUsername(result.username || '');
            // BƯỚC 3.5: Sau khi login thành công, lấy thông tin user
            console.log('🔄 Đang lấy thông tin user...');
            const userData = await userService.getCurrentUser();

            if (userData) {
                setUser(userData[0]);
                setIsAuthenticated(true);
                console.log('✅ Đã lấy được thông tin user:', userData);

                // Chuyển đến dashboard
                navigate('/home-page', { replace: true });
                return true;
            } else {
                throw new Error('Không lấy được thông tin user');
            }
        } catch (error: any) {
            console.error('❌ Lỗi đăng nhập:', error);
            setIsAuthenticated(false);
            setUser(null);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * BƯỚC 3.6: Hàm đăng xuất
     */
    const logout = () => {
        console.log('👋 Đăng xuất từ context...');

        // Xóa tất cả dữ liệu
        authService.logout();
        userService.clearUserCache();

        // Reset state
        setUser(null);
        setIsAuthenticated(false);
        setRemainingTime(0);

        // Chuyển về trang login
        navigate('/login');
    };

    /**
     * BƯỚC 3.7: Kiểm tra auth khi load app
     */
    useEffect(() => {
        const checkAuth = async () => {
            console.log('🔍 Kiểm tra trạng thái đăng nhập...');
            setIsLoading(true);

            // Kiểm tra token còn hạn không
            if (!authService.isTokenExpired()) {
                // Token còn hạn, lấy thông tin user
                const userData = await userService.getCurrentUser();
                if (userData) {
                    setUser(userData);
                    setIsAuthenticated(true);
                    console.log('✅ Đã đăng nhập với user:', userData.name);
                }
            } else {
                console.log('❌ Token đã hết hạn hoặc không tồn tại');
            }

            setIsLoading(false);
        };

        checkAuth();
    }, []);

    /**
     * BƯỚC 3.8: COUNTDOWN TIMER - Đếm ngược thời gian token
     */
    useEffect(() => {
        // Chỉ chạy khi đã đăng nhập
        if (!isAuthenticated) return;

        console.log('⏰ Bắt đầu đếm ngược thời gian token...');

        // Cập nhật mỗi giây
        const interval = setInterval(() => {
            const remaining = authService.getTokenRemainingTime();
            setRemainingTime(remaining);

            // Log mỗi 10 giây
            if (remaining % 10 === 0) {
                console.log(`⏱️ Token còn lại: ${remaining} giây`);
            }

            // BƯỚC 3.9: TỰ ĐỘNG LOGOUT KHI HẾT HẠN
            if (remaining <= 0) {
                console.log('🔴 Token đã hết hạn - Tự động đăng xuất');
                alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
                logout();
            }

            // Cảnh báo khi sắp hết hạn (< 60 giây)
            if (remaining === 60) {
                alert('⚠️ Phiên đăng nhập sẽ hết hạn sau 1 phút!');
            }
        }, 1000); // Cập nhật mỗi 1 giây

        // Cleanup khi unmount
        return () => {
            console.log('🧹 Dừng countdown timer');
            clearInterval(interval);
        };
    }, [isAuthenticated]); // Chỉ chạy lại khi isAuthenticated thay đổi

    // ===== BƯỚC 3.10: CONTEXT VALUE =====
    const contextValue: AuthContextType = {
        user,
        setUser,
        isAuthenticated,
        isLoading,
        remainingTime,
        login,
        logout,
        role,
        setRole,
        username
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// ===== BƯỚC 3.11: CUSTOM HOOK =====
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth phải được sử dụng trong AuthProvider');
    }
    return context;
};