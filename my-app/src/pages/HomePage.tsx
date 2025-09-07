import React, {useState} from 'react';
import {useAuth} from "../context/auth-context.tsx";
import {EditProfileModal} from "./EditProfile.tsx";

interface User {
    id: number;
    name: string;
    phone: string;
    user_id: number;
    email: string;
}

export const HomePage: React.FC = () => {
    // Lấy user và role từ Auth Context
    const { user, role, isAuthenticated, logout } = useAuth();
    const [isModalOpen,setIsModalOpen] = useState(false);
    const handleLogout = () => {
        logout();
    };

    const navigateTo = (path: string) => {
        console.log(`Navigate to: ${path}`);
    };

    const getRoleDisplayName = (userRole: string) => {
        switch(userRole) {
            case 'admin': return 'Quản trị viên';
            case 'doctor': return 'Bác sĩ';
            case 'patient': return 'Bệnh nhân';
            default: return 'Người dùng';
        }
    };

    const renderRoleSpecificButtons = () => {
        if (!user || !role) return null;

        switch (role) {
            case 'patient':
                return (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <button
                            onClick={() => navigateTo('/patient/appointments')}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-lg text-center transition"
                        >
                            <div className="text-2xl mb-2">📅</div>
                            <span className="font-semibold">Đặt lịch khám</span>
                        </button>

                        <button
                            onClick={() => navigateTo('/patient/history')}
                            className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg text-center transition"
                        >
                            <div className="text-2xl mb-2">📋</div>
                            <span className="font-semibold">Lịch sử khám</span>
                        </button>

                        <button
                            onClick={() => navigateTo('/patient/medical-records')}
                            className="bg-purple-500 hover:bg-purple-600 text-white p-4 rounded-lg text-center transition"
                        >
                            <div className="text-2xl mb-2">📄</div>
                            <span className="font-semibold">Hồ sơ bệnh án</span>
                        </button>

                        <button
                            onClick={() => navigateTo('/patient/prescriptions')}
                            className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-lg text-center transition"
                        >
                            <div className="text-2xl mb-2">💊</div>
                            <span className="font-semibold">Đơn thuốc</span>
                        </button>

                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-gray-500 hover:bg-gray-600 text-white p-4 rounded-lg text-center transition"
                        >
                            <div className="text-2xl mb-2">👤</div>
                            <span className="font-semibold">chỉnh sửa thông tin cá nhân</span>
                        </button>
                    </div>
                );

            case 'doctor':
                return (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <button
                            onClick={() => navigateTo('/doctor/appointments')}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-lg text-center transition"
                        >
                            <div className="text-2xl mb-2">📅</div>
                            <span className="font-semibold">Lịch khám hôm nay</span>
                        </button>

                        <button
                            onClick={() => navigateTo('/doctor/approve-appointments')}
                            className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg text-center transition"
                        >
                            <div className="text-2xl mb-2">✅</div>
                            <span className="font-semibold">Duyệt lịch hẹn</span>
                        </button>

                        <button
                            onClick={() => navigateTo('/doctor/patients')}
                            className="bg-purple-500 hover:bg-purple-600 text-white p-4 rounded-lg text-center transition"
                        >
                            <div className="text-2xl mb-2">👥</div>
                            <span className="font-semibold">Danh sách bệnh nhân</span>
                        </button>

                        <button
                            onClick={() => navigateTo('/doctor/medical-records')}
                            className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-lg text-center transition"
                        >
                            <div className="text-2xl mb-2">📄</div>
                            <span className="font-semibold">Hồ sơ bệnh án</span>
                        </button>

                        <button
                            onClick={() => navigateTo('/doctor/prescriptions')}
                            className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-lg text-center transition"
                        >
                            <div className="text-2xl mb-2">💊</div>
                            <span className="font-semibold">Kê đơn thuốc</span>
                        </button>

                        <button
                            onClick={() => navigateTo('/doctor/schedule')}
                            className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-lg text-center transition"
                        >
                            <div className="text-2xl mb-2">⏰</div>
                            <span className="font-semibold">Quản lý lịch trình</span>
                        </button>

                        <button
                            onClick={() => navigateTo('/doctor/consultations')}
                            className="bg-indigo-500 hover:bg-indigo-600 text-white p-4 rounded-lg text-center transition"
                        >
                            <div className="text-2xl mb-2">💬</div>
                            <span className="font-semibold">Tư vấn trực tuyến</span>
                        </button>

                        <button
                            onClick={() => navigateTo('/doctor/reports')}
                            className="bg-gray-500 hover:bg-gray-600 text-white p-4 rounded-lg text-center transition"
                        >
                            <div className="text-2xl mb-2">📊</div>
                            <span className="font-semibold">Báo cáo</span>
                        </button>
                    </div>
                );

            case 'admin':
                return (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <button
                            onClick={() => navigateTo('/admin/dashboard')}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-lg text-center transition"
                        >
                            <div className="text-2xl mb-2">📊</div>
                            <span className="font-semibold">Dashboard</span>
                        </button>

                        <button
                            onClick={() => navigateTo('/admin/users')}
                            className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg text-center transition"
                        >
                            <div className="text-2xl mb-2">👥</div>
                            <span className="font-semibold">Quản lý người dùng</span>
                        </button>

                        <button
                            onClick={() => navigateTo('/admin/doctors')}
                            className="bg-purple-500 hover:bg-purple-600 text-white p-4 rounded-lg text-center transition"
                        >
                            <div className="text-2xl mb-2">👨‍⚕️</div>
                            <span className="font-semibold">Quản lý bác sĩ</span>
                        </button>

                        <button
                            onClick={() => navigateTo('/admin/departments')}
                            className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-lg text-center transition"
                        >
                            <div className="text-2xl mb-2">🏢</div>
                            <span className="font-semibold">Quản lý khoa</span>
                        </button>

                        <button
                            onClick={() => navigateTo('/admin/appointments')}
                            className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-lg text-center transition"
                        >
                            <div className="text-2xl mb-2">📅</div>
                            <span className="font-semibold">Quản lý lịch hẹn</span>
                        </button>

                        <button
                            onClick={() => navigateTo('/admin/reports')}
                            className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-lg text-center transition"
                        >
                            <div className="text-2xl mb-2">📋</div>
                            <span className="font-semibold">Báo cáo thống kê</span>
                        </button>

                        <button
                            onClick={() => navigateTo('/admin/system')}
                            className="bg-indigo-500 hover:bg-indigo-600 text-white p-4 rounded-lg text-center transition"
                        >
                            <div className="text-2xl mb-2">⚙️</div>
                            <span className="font-semibold">Cấu hình hệ thống</span>
                        </button>

                        <button
                            onClick={() => navigateTo('/admin/backup')}
                            className="bg-gray-500 hover:bg-gray-600 text-white p-4 rounded-lg text-center transition"
                        >
                            <div className="text-2xl mb-2">💾</div>
                            <span className="font-semibold">Sao lưu dữ liệu</span>
                        </button>
                    </div>
                );

            default:
                return null;
        }
    };

    const renderUserProfile = () => {
        if (!user || !role) return null;

        return (
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                <h3 className="text-2xl font-bold text-emerald-600 text-center mb-6">
                    Thông tin cá nhân
                </h3>

                <div className="max-w-2xl mx-auto">
                    <div className="flex items-center justify-center mb-6">
                        <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                            {user.name?.charAt(0) || 'U'}
                        </div>
                    </div>

                    <div className="text-center mb-6">
                        <h4 className="text-xl font-bold text-gray-800 mb-2">{user.name}</h4>
                        <p className="text-emerald-600 font-semibold">{getRoleDisplayName(role)}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <label className="block text-sm font-semibold text-gray-600 mb-1">Email</label>
                            <p className="text-gray-800">{user.email}</p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <label className="block text-sm font-semibold text-gray-600 mb-1">Số điện thoại</label>
                            <p className="text-gray-800">{user.phone}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-emerald-500 text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <span className="text-2xl">🏥</span>
                            <h1 className="text-xl font-bold">Bệnh viện ABC</h1>
                        </div>
                        <nav className="flex items-center space-x-6">
                            <button
                                onClick={() => navigateTo('/')}
                                className="hover:text-emerald-200 transition cursor-pointer"
                            >
                                Trang chủ
                            </button>

                            <button
                                onClick={() => navigateTo('/about')}
                                className="hover:text-emerald-200 transition cursor-pointer"
                            >
                                Giới thiệu
                            </button>

                            {isAuthenticated && user && role ? (
                                <div className="flex items-center space-x-4">
                                    <span className="text-sm">
                                        Xin chào, {user.name} ({getRoleDisplayName(role)})
                                    </span>
                                    <button
                                        onClick={handleLogout}
                                        className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm transition"
                                    >
                                        Đăng xuất
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => navigateTo('/login')}
                                        className="bg-emerald-600 hover:bg-emerald-700 px-4 py-1 rounded transition"
                                    >
                                        Đăng nhập
                                    </button>
                                    <button
                                        onClick={() => navigateTo('/register')}
                                        className="bg-white text-emerald-500 hover:bg-gray-100 px-4 py-1 rounded transition"
                                    >
                                        Đăng ký
                                    </button>
                                </div>
                            )}
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* User Profile Section */}
                {isAuthenticated && user && role && renderUserProfile()}

                {/* Role-specific Quick Actions */}
                {isAuthenticated && user && role && (
                    <section className="mb-12">
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <h3 className="text-2xl font-bold text-emerald-600 text-center mb-8">
                                Chức năng chính - {getRoleDisplayName(role)}
                            </h3>
                            {renderRoleSpecificButtons()}
                        </div>
                    </section>
                )}

                {/* Welcome Message for Guest Users */}
                {!isAuthenticated && (
                    <section className="text-center py-16">
                        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
                            <h2 className="text-3xl font-bold text-gray-800 mb-4">
                                Chào mừng đến với Bệnh viện ABC
                            </h2>
                            <p className="text-gray-600 mb-8">
                                Vui lòng đăng nhập để sử dụng các dịch vụ của bệnh viện
                            </p>
                            <div className="space-x-4">
                                <button
                                    onClick={() => navigateTo('/login')}
                                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold transition"
                                >
                                    Đăng nhập
                                </button>
                                <button
                                    onClick={() => navigateTo('/register')}
                                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition"
                                >
                                    Đăng ký
                                </button>
                            </div>
                        </div>
                    </section>
                )}
            </main>

            {/* Edit Profile Modal */}
            <EditProfileModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

            {/* Footer */}
            <footer className="bg-emerald-500 text-white mt-16">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="text-center">
                        <p className="text-lg font-semibold mb-2">
                            © 2025 Bệnh viện ABC - Hệ thống quản lý bệnh viện
                        </p>
                        <p className="text-emerald-200">
                            Bản quyền thuộc về Bệnh viện ABC. Tất cả quyền được bảo lưu.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};