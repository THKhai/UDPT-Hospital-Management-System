import React, { useState } from 'react';

interface User {
    id: number;
    username: string;
    email?: string;
}

const HomePage: React.FC = () => {
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [reason, setReason] = useState('');
    const [isUrgent, setIsUrgent] = useState(false);

    // Mock user - trong thực tế sẽ lấy từ Auth Context
    const isAuthenticated = true; // Thay đổi để test
    const currentUser: User = { id: 1, username: 'Nguyễn Văn A', email: 'user@example.com' };

    const handleLogout = () => {
        // authService.logout();
        console.log('Logging out...');
    };

    const handleBookingSubmit = () => {
        console.log('Booking appointment:', {
            selectedDepartment,
            selectedDoctor,
            selectedDate,
            selectedTime,
            reason,
            isUrgent
        });
        // Handle booking logic here
        alert('Đặt lịch khám thành công!');
    };

    const navigateTo = (path: string) => {
        console.log(`Navigate to: ${path}`);
        // Handle navigation
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
                                onClick={() => navigateTo('/appointment')}
                                className="hover:text-emerald-200 transition cursor-pointer"
                            >
                                Đặt lịch khám
                            </button>
                            <button
                                onClick={() => navigateTo('/about')}
                                className="hover:text-emerald-200 transition cursor-pointer"
                            >
                                Giới thiệu
                            </button>

                            {isAuthenticated ? (
                                <div className="flex items-center space-x-4">
                                    <span className="text-sm">Xin chào, {currentUser.username}</span>
                                    <button
                                        onClick={() => navigateTo('/dashboard')}
                                        className="bg-emerald-600 hover:bg-emerald-700 px-3 py-1 rounded text-sm transition"
                                    >
                                        Dashboard
                                    </button>
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
                {/* Hero Section */}
                <section className="text-center mb-12">
                    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
                        <div className="text-6xl mb-4">🏥</div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">
                            Hệ thống quản lý bệnh viện ABC
                        </h2>
                        <p className="text-gray-600 text-lg mb-6">
                            Chăm sóc sức khỏe toàn diện với đội ngũ bác sĩ chuyên nghiệp và trang thiết bị hiện đại
                        </p>
                        <button
                            onClick={() => navigateTo(isAuthenticated ? '/dashboard' : '/login')}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold transition text-lg"
                        >
                            {isAuthenticated ? 'Vào hệ thống' : 'Đăng nhập ngay'}
                        </button>
                    </div>
                </section>

                {/* Appointment Booking Section */}
                <section className="mb-12">
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <h3 className="text-2xl font-bold text-emerald-600 text-center mb-8">
                            Đặt lịch khám
                        </h3>

                        <div className="max-w-4xl mx-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-emerald-600 font-semibold mb-2">
                                        Chọn khoa khám
                                    </label>
                                    <select
                                        value={selectedDepartment}
                                        onChange={(e) => setSelectedDepartment(e.target.value)}
                                        className="w-full border-2 border-emerald-300 rounded-lg px-4 py-3 focus:border-emerald-500 focus:outline-none text-gray-700"
                                    >
                                        <option value="">-- Chọn khoa --</option>
                                        <option value="noi">Khoa Nội</option>
                                        <option value="ngoai">Khoa Ngoại</option>
                                        <option value="san">Khoa Sản</option>
                                        <option value="nhi">Khoa Nhi</option>
                                        <option value="mat">Khoa Mắt</option>
                                        <option value="rang">Khoa Răng Hàm Mặt</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-emerald-600 font-semibold mb-2">
                                        Chọn bác sĩ
                                    </label>
                                    <select
                                        value={selectedDoctor}
                                        onChange={(e) => setSelectedDoctor(e.target.value)}
                                        className="w-full border-2 border-emerald-300 rounded-lg px-4 py-3 focus:border-emerald-500 focus:outline-none text-gray-700"
                                    >
                                        <option value="">-- Chọn bác sĩ --</option>
                                        <option value="dr1">BS. Nguyễn Văn A</option>
                                        <option value="dr2">BS. Trần Thị B</option>
                                        <option value="dr3">BS. Lê Văn C</option>
                                        <option value="dr4">BS. Phạm Thị D</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-emerald-600 font-semibold mb-2">
                                        Chọn ngày
                                    </label>
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        className="w-full border-2 border-emerald-300 rounded-lg px-4 py-3 focus:border-emerald-500 focus:outline-none text-gray-700"
                                    />
                                </div>

                                <div>
                                    <label className="block text-emerald-600 font-semibold mb-2">
                                        Chọn giờ
                                    </label>
                                    <select
                                        value={selectedTime}
                                        onChange={(e) => setSelectedTime(e.target.value)}
                                        className="w-full border-2 border-emerald-300 rounded-lg px-4 py-3 focus:border-emerald-500 focus:outline-none text-gray-700"
                                    >
                                        <option value="">-- Chọn giờ --</option>
                                        <option value="08:00">08:00</option>
                                        <option value="09:00">09:00</option>
                                        <option value="10:00">10:00</option>
                                        <option value="14:00">14:00</option>
                                        <option value="15:00">15:00</option>
                                        <option value="16:00">16:00</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-emerald-600 font-semibold mb-2">
                                    Lý do khám
                                </label>
                                <textarea
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    className="w-full border-2 border-emerald-300 rounded-lg px-4 py-3 focus:border-emerald-500 focus:outline-none text-gray-700"
                                    rows={4}
                                    placeholder="Nhập lý do khám..."
                                />
                            </div>

                            <div className="mb-8">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={isUrgent}
                                        onChange={(e) => setIsUrgent(e.target.checked)}
                                        className="w-4 h-4 text-emerald-600 border-2 border-emerald-300 rounded focus:ring-emerald-500"
                                    />
                                    <span className="text-gray-700">Đặt lịch khám cấp</span>
                                </label>
                            </div>

                            <div className="text-center">
                                <button
                                    onClick={handleBookingSubmit}
                                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold transition text-lg"
                                >
                                    Xác nhận đặt lịch
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Services Section */}
                <section className="mb-12">
                    <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">
                            Dịch vụ của chúng tôi
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition cursor-pointer"
                             onClick={() => navigateTo('/services/general')}>
                            <div className="text-4xl mb-4">👨‍⚕️</div>
                            <h4 className="text-xl font-semibold text-gray-800 mb-2">Khám tổng quát</h4>
                            <p className="text-gray-600">Khám sức khỏe định kỳ với đội ngũ bác sĩ giàu kinh nghiệm</p>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition cursor-pointer"
                             onClick={() => navigateTo('/services/lab')}>
                            <div className="text-4xl mb-4">🔬</div>
                            <h4 className="text-xl font-semibold text-gray-800 mb-2">Xét nghiệm</h4>
                            <p className="text-gray-600">Xét nghiệm máu, nước tiểu và các xét nghiệm chuyên khoa</p>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition cursor-pointer"
                             onClick={() => navigateTo('/services/inpatient')}>
                            <div className="text-4xl mb-4">🏥</div>
                            <h4 className="text-xl font-semibold text-gray-800 mb-2">Điều trị nội trú</h4>
                            <p className="text-gray-600">Chăm sóc 24/7 với trang thiết bị y tế hiện đại</p>
                        </div>
                    </div>
                </section>

                {/* Quick Actions - Only show when authenticated */}
                {isAuthenticated && (
                    <section className="mb-12">
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <h3 className="text-2xl font-bold text-emerald-600 text-center mb-8">
                                Truy cập nhanh
                            </h3>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                                <button
                                    onClick={() => navigateTo('/dashboard')}
                                    className="bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-lg text-center transition"
                                >
                                    <div className="text-2xl mb-2">📊</div>
                                    <span className="font-semibold">Dashboard</span>
                                </button>

                                <button
                                    onClick={() => navigateTo('/patients')}
                                    className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg text-center transition"
                                >
                                    <div className="text-2xl mb-2">👥</div>
                                    <span className="font-semibold">Bệnh nhân</span>
                                </button>

                                <button
                                    onClick={() => navigateTo('/appointments')}
                                    className="bg-purple-500 hover:bg-purple-600 text-white p-4 rounded-lg text-center transition"
                                >
                                    <div className="text-2xl mb-2">📅</div>
                                    <span className="font-semibold">Lịch hẹn</span>
                                </button>

                                <button
                                    onClick={() => navigateTo('/reports')}
                                    className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-lg text-center transition"
                                >
                                    <div className="text-2xl mb-2">📋</div>
                                    <span className="font-semibold">Báo cáo</span>
                                </button>
                            </div>
                        </div>
                    </section>
                )}

                {/* Statistics Section */}
                <section className="mb-12">
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <h3 className="text-2xl font-bold text-gray-800 text-center mb-8">
                            Thống kê bệnh viện
                        </h3>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-emerald-600 mb-2">1,250</div>
                                <div className="text-gray-600">Bệnh nhân điều trị</div>
                            </div>

                            <div className="text-center">
                                <div className="text-3xl font-bold text-blue-600 mb-2">85</div>
                                <div className="text-gray-600">Bác sĩ chuyên khoa</div>
                            </div>

                            <div className="text-center">
                                <div className="text-3xl font-bold text-purple-600 mb-2">320</div>
                                <div className="text-gray-600">Lịch hẹn hôm nay</div>
                            </div>

                            <div className="text-center">
                                <div className="text-3xl font-bold text-orange-600 mb-2">98%</div>
                                <div className="text-gray-600">Hài lòng khách hàng</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Emergency Contact */}
                <section className="mb-12">
                    <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6">
                        <div className="flex items-center">
                            <div className="text-3xl text-red-500 mr-4">🚨</div>
                            <div>
                                <h4 className="text-xl font-bold text-red-800 mb-2">Trường hợp cấp cứu</h4>
                                <p className="text-red-700 mb-2">
                                    Gọi ngay hotline cấp cứu 24/7: <span className="font-bold">0123 456 789</span>
                                </p>
                                <p className="text-red-600 text-sm">
                                    Hoặc đến trực tiếp khoa Cấp cứu tại tầng 1, Bệnh viện ABC
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-emerald-500 text-white mt-16">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
                        <div>
                            <h4 className="text-lg font-bold mb-4">Liên hệ</h4>
                            <div className="space-y-2">
                                <p>📍 123 Đường ABC, Quận 1, TP.HCM</p>
                                <p>📞 0123 456 789</p>
                                <p>📧 support@benhvienabc.vn</p>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-lg font-bold mb-4">Giờ làm việc</h4>
                            <div className="space-y-2">
                                <p>Thứ 2 - Thứ 6: 7:00 - 21:00</p>
                                <p>Thứ 7 - Chủ nhật: 8:00 - 20:00</p>
                                <p>Cấp cứu: 24/7</p>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-lg font-bold mb-4">Theo dõi</h4>
                            <div className="flex space-x-4">
                                <button className="bg-blue-600 hover:bg-blue-700 p-2 rounded transition">
                                    Facebook
                                </button>
                                <button className="bg-blue-400 hover:bg-blue-500 p-2 rounded transition">
                                    Twitter
                                </button>
                                <button className="bg-red-600 hover:bg-red-700 p-2 rounded transition">
                                    YouTube
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-emerald-400 pt-6 text-center">
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

export default HomePage;