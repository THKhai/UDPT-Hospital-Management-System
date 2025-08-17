import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="py-3 shadow-sm bg-primary">
      <div className="container mx-auto flex justify-between items-center px-4">
        <h1 className="text-xl font-bold mb-0 text-white">🏥 Bệnh viện ABC</h1>
        <nav className="flex items-center gap-6">
          <Link
            to="/"
            className="text-white hover:text-primary-hover transition"
          >
            Trang chủ
          </Link>
          <Link
            to="/booking"
            className="text-white hover:text-primary-hover transition"
          >
            Đặt lịch khám
          </Link>
          <Link
            to="/about"
            className="text-white hover:text-primary-hover transition"
          >
            Giới thiệu
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
