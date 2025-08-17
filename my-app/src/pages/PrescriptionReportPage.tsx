import React, { useState } from "react";
import Layout from "../components/Layout";

type ReportType = "day" | "month" | "year";

export default function PrescriptionReportPage() {
  const [reportType, setReportType] = useState<ReportType>("day");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState<"none" | "error" | "nodata" | "success">("none");
  const [total, setTotal] = useState<number | null>(null);

  // Xác định input type theo loại thống kê
  let inputType = "date";
  if (reportType === "month") inputType = "month";
  if (reportType === "year") inputType = "number";

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setReportType(e.target.value as ReportType);
    setDate("");
    setStatus("none");
    setTotal(null);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("none");
    // Giả lập random lỗi hoặc không có dữ liệu
    if (!date || Math.random() < 0.1) {
      setStatus("error");
      setTotal(null);
      return;
    } else if (Math.random() < 0.2) {
      setStatus("nodata");
      setTotal(null);
      return;
    }
    // Có dữ liệu
    setStatus("success");
    setTotal(128);
  };

  return (
    <Layout>
      <main className="container mx-auto my-8 flex-1 px-2">
        <h2 className="text-center text-primary text-2xl font-bold mb-6">
          Báo cáo số lượng đơn thuốc đã cấp
        </h2>
        {/* Form chọn thời gian */}
        <form
          className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6"
          onSubmit={handleSubmit}
        >
          <div className="md:col-span-4">
            <label htmlFor="reportType" className="block font-medium mb-1 text-primary">
              Chọn loại thống kê
            </label>
            <select
              id="reportType"
              className="w-full border border-primary rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              value={reportType}
              onChange={handleTypeChange}
            >
              <option value="day">Theo ngày</option>
              <option value="month">Theo tháng</option>
              <option value="year">Theo năm</option>
            </select>
          </div>
          <div className="md:col-span-4">
            <label htmlFor="reportDate" className="block font-medium mb-1 text-primary">
              Chọn thời gian
            </label>
            <input
              type={inputType}
              id="reportDate"
              className="w-full border border-primary rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              value={date}
              onChange={handleDateChange}
              placeholder={reportType === "year" ? "2025" : ""}
              min={reportType === "year" ? "2000" : undefined}
              max={reportType === "year" ? "2100" : undefined}
              required
            />
          </div>
          <div className="md:col-span-4 flex items-end">
            <button
              type="submit"
              className="bg-primary hover:bg-primaryHover text-white font-semibold px-6 py-2 rounded transition w-full"
            >
              Xem báo cáo
            </button>
          </div>
        </form>

        {/* Kết quả báo cáo */}
        {status === "success" && total !== null && (
          <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded mb-4 text-center">
            Tổng số đơn thuốc: <strong>{total}</strong> đơn
          </div>
        )}
        {/* Không có dữ liệu */}
        {status === "nodata" && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded mb-4 text-center">
            Không có dữ liệu trong khoảng thời gian đã chọn.
          </div>
        )}
        {/* Lỗi hệ thống */}
        {status === "error" && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-4 text-center">
            Lỗi kết nối. Vui lòng thử lại sau.
          </div>
        )}
      </main>
    </Layout>
  );
}