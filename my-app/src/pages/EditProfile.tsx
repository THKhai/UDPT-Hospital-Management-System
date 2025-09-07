import React, { useState, useEffect } from 'react';
import { useAuth } from "../context/auth-context.tsx";

interface User {
    id: number;
    name: string;
    phone: string;
    user_id: number;
    email: string;
}

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
                                                                      isOpen,
                                                                      onClose
}) => {
    const { user,username,setUser } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{[key: string]: string}>({});

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: ''
    });

    // Initialize form data when modal opens or user changes
    useEffect(() => {
        if (user && isOpen) {
            setFormData({
                name: user.name || '',
                phone: user.phone || '',
                email: user.email || ''
            });
            setErrors({});
        }
    }, [user, isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors: {[key: string]: string} = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Họ và tên không được để trống';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Số điện thoại không được để trống';
        } else if (!/^[0-9+\-\s()]{10,15}$/.test(formData.phone.trim())) {
            newErrors.phone = 'Số điện thoại không hợp lệ';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email không được để trống';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
            newErrors.email = 'Email không hợp lệ';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm() || !user) {
            return;
        }

        setIsLoading(true);

        try {
            // Prepare API request
            const updateData = {
                name: formData.name.trim(),
                phone: formData.phone.trim(),
                email: formData.email.trim()
            };

            console.log('Updating profile with data:', updateData);

            // API call to PUT /patients/patients_update using username from props
            const response = await fetch(`http://localhost:8000/patients/patients_update?username=${username}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            else if(response.status==200){
                setUser({...user,name:updateData.name,phone:updateData.phone,email:updateData.email});
            }

            const updatedUser = await response.json();

            alert('Cập nhật thông tin thành công!');
            onClose();

        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại!');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        if (!isLoading) {
            setFormData({
                name: user?.name || '',
                phone: user?.phone || '',
                email: user?.email || ''
            });
            setErrors({});
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Chỉnh sửa thông tin cá nhân
                    </h2>
                    <button
                        onClick={handleClose}
                        disabled={isLoading}
                        className="text-gray-400 hover:text-gray-600 transition disabled:opacity-50"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Name Field */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                            Họ và tên <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition ${
                                errors.name
                                    ? 'border-red-500 focus:border-red-500'
                                    : 'border-gray-300 focus:border-emerald-500'
                            }`}
                            placeholder="Nhập họ và tên"
                            disabled={isLoading}
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                        )}
                    </div>

                    {/* Phone Field */}
                    <div>
                        <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                            Số điện thoại <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition ${
                                errors.phone
                                    ? 'border-red-500 focus:border-red-500'
                                    : 'border-gray-300 focus:border-emerald-500'
                            }`}
                            placeholder="Nhập số điện thoại"
                            disabled={isLoading}
                        />
                        {errors.phone && (
                            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                        )}
                    </div>

                    {/* Email Field */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition ${
                                errors.email
                                    ? 'border-red-500 focus:border-red-500'
                                    : 'border-gray-300 focus:border-emerald-500'
                            }`}
                            placeholder="Nhập email"
                            disabled={isLoading}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                        )}
                    </div>

                    {/* Info Box */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start space-x-2">
                            <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            <div>
                                <p className="text-sm text-blue-800 font-medium">Thông tin quan trọng</p>
                                <p className="text-sm text-blue-700 mt-1">
                                    Vui lòng đảm bảo thông tin chính xác để chúng tôi có thể liên hệ với bạn khi cần thiết.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isLoading}
                            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 font-medium"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition disabled:opacity-50 font-medium flex items-center justify-center space-x-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    <span>Đang lưu...</span>
                                </>
                            ) : (
                                <span>Lưu thay đổi</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};