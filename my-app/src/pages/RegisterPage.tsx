import React, { useState } from "react";
import Layout from "../components/Layout";
import {authService} from "../service/authservice.ts";
import { useNavigate } from "react-router-dom"; // thêm dòng này

type UserRole = "admin" | "doctor" | "patient" | "employee";

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export default function RegisterPage() {
    const navigate = useNavigate(); // và thêm dòng này
    const [form, setForm] = useState({
        username: "",
        password: "",
        name: "",
        email: "",
        role: "patient" as UserRole, // backend default là employee
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setSuccess(false);

        if (!form.username || !form.password || !form.name || !form.email) {
            setError("Vui lòng nhập đầy đủ thông tin bắt buộc.");
            return;
        }

        setIsLoading(true);
        try {
            // Chuẩn bị credentials đúng theo DTO
            const credentials = {
                username: form.username.trim(),
                password: form.password,
                name: form.name.trim(),
                email: form.email.trim(),
                role: form.role, // có thể để "employee" mặc định
            };

            // Gọi register (trả về { success, username? })
            const res = await authService.register(credentials);
            if (!res?.success) {
                throw new Error(res?.error || "Đăng ký thất bại");
            }

            setSuccess(true);

            await sleep(1500);

            // Đăng nhập tự động tương tự flow login
            const loginRes = await authService.login({
                username: credentials.username,
                password: credentials.password,
            });

            if (loginRes.success) {
                // Điều hướng sang trang chính
                navigate("/Home", { replace: true });
                return;
            }

            // Nếu auto-login không thành công, chuyển sang trang login
            navigate("/login", { replace: true });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Đăng ký thất bại");
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <Layout>
            <div className="container my-8">
                <div className="max-w-xl mx-auto bg-white shadow rounded-2xl p-8">
                    <h3 className="text-center text-primary text-2xl font-bold mb-6">
                        Đăng ký tài khoản
                    </h3>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded mb-4">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded mb-4">
                            Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="username" className="block font-medium mb-1 text-primary">
                                Tên đăng nhập
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                className="w-full border border-primary rounded px-3 py-2"
                                placeholder="Nhập tên đăng nhập"
                                value={form.username}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block font-medium mb-1 text-primary">
                                Mật khẩu
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                className="w-full border border-primary rounded px-3 py-2"
                                placeholder="Nhập mật khẩu"
                                value={form.password}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label htmlFor="name" className="block font-medium mb-1 text-primary">
                                Họ và tên
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                className="w-full border border-primary rounded px-3 py-2"
                                placeholder="Nhập họ và tên"
                                value={form.name}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block font-medium mb-1 text-primary">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                className="w-full border border-primary rounded px-3 py-2"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label htmlFor="role" className="block font-medium mb-1 text-primary">
                                Vai trò (tùy chọn)
                            </label>
                            <select
                                id="role"
                                name="role"
                                className="w-full border border-primary rounded px-3 py-2 bg-white"
                                value={form.role}
                                onChange={handleChange}
                                disabled={isLoading}
                            >
                                <option value="patient">Patient (mặc định)</option>
                                <option value="doctor">Doctor</option>
                            </select>
                            <p className="text-xs text-gray-500 mt-1">
                                Nếu không chọn, hệ thống sẽ đăng ký với vai trò employee.
                            </p>
                        </div>

                        <button
                            type="submit"
                            className="bg-primary hover:bg-primary-hover text-white font-semibold px-6 py-2 rounded transition w-full disabled:opacity-50"
                            disabled={isLoading}
                        >
                            {isLoading ? "Đang đăng ký..." : "Tạo tài khoản"}
                        </button>
                    </form>
                </div>
            </div>
        </Layout>
    );
}