import React, { useState } from "react";
import Layout from "../components/Layout";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Xử lý đăng nhập ở đây
  };

  return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <div className="bg-white shadow p-8 rounded-2xl w-full max-w-md">
          <h3 className="text-center text-primary text-2xl font-bold mb-6">Đăng nhập hệ thống</h3>
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
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-white py-2 rounded font-semibold hover:bg-primary-hover transition"
            >
              Đăng nhập
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