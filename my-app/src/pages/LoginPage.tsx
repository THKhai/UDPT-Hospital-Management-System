import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {useAuth} from "../context/auth-context.tsx";
function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const {login} = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            // Gọi authService để đăng nhập
            const result = await login({
                username: username.trim(),
                password
            });

            console.log("Login successful:", result);
            // Chuyển hướng đến trang chính
            navigate("/home-page", { replace: true });

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Đăng nhập thất bại";
            setError(errorMessage);
            console.error("Login error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
            <div className="bg-white shadow p-8 rounded-2xl w-full max-w-md">
                <h3 className="text-center text-primary text-2xl font-bold mb-6">
                    Đăng nhập hệ thống
                </h3>

                {/* Hiển thị lỗi nếu có */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="username" className="block font-medium mb-1 text-primary">
                            Tên đăng nhập hoặc Email
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            className="w-full border border-primary rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-gray-900"
                            placeholder="Nhập tên đăng nhập"
                            required
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="password" className="block font-medium mb-1 text-primary">
                            Mật khẩu
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="w-full border border-primary rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-gray-900"
                            placeholder="Nhập mật khẩu"
                            required
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-primary text-white py-2 rounded font-semibold hover:bg-primary-hover transition disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isLoading}
                    >
                        {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                    </button>

                    <div className="mt-3 text-right">
                        <a href="#" className="text-primary hover:text-primary-hover text-sm">
                            Quên mật khẩu?
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;
