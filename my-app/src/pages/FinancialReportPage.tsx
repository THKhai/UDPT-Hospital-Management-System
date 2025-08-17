import React, { useState } from "react";
import Layout from "../components/Layout";

type ReportType = "month" | "quarter" | "year" | "custom";

interface ReportRow {
  date: string;
  income: string;
  expense: string;
  profit: string;
}

export default function FinancialReportPage() {
  const [type, setType] = useState<ReportType>("month");
  const [time, setTime] = useState("");
  const [status, setStatus] = useState<"none" | "error" | "nodata" | "success">("none");
  const [report, setReport] = useState<ReportRow[]>([]);
  const [totalIncome, setTotalIncome] = useState("");
  const [totalExpense, setTotalExpense] = useState("");
  const [profit, setProfit] = useState("");

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setType(e.target.value as ReportType);
    setTime("");
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTime(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("none");
    // Giả lập random lỗi hoặc không có dữ liệu
    if (!time || Math.random() < 0.1) {
      setStatus("error");
      return;
    } else if (Math.random() < 0.3) {
      setStatus("nodata");
      return;
    }
    // Có dữ liệu
    setStatus("success");
    setTotalIncome("150,000,000đ");
    setTotalExpense("90,000,000đ");
    setProfit("60,000,000đ");
    setReport([
      { date: "01/07/2025", income: "30,000,000", expense: "15,000,000", profit: "15,000,000" },
      { date: "10/07/2025", income: "50,000,000", expense: "30,000,000", profit: "20,000,000" },
      { date: "20/07/2025", income: "70,000,000", expense: "45,000,000", profit: "25,000,000" },
    ]);
  };

  // Xác định input type và label theo loại báo cáo
  let inputType = "month";
  let inputLabel = "Chọn tháng";
  let inputPlaceholder = "";
  if (type === "year") {
    inputType = "number";
    inputLabel = "Chọn năm";
    inputPlaceholder = "2025";
  } else if (type === "quarter") {
    inputType = "text";
    inputLabel = "Nhập quý";
    inputPlaceholder = "Q1/2025";
  } else if (type === "custom") {
    inputType = "date";
    inputLabel = "Từ ngày";
  }

  return (
    <Layout>
      <main className="container mx-auto my-8 flex-1 px-2">
        <h2 className="text-center text-primary text-2xl font-bold mb-6">Báo cáo tài chính</h2>
        {/* Bộ lọc thời gian */}
        <form
          className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end mb-6"
          onSubmit={handleSubmit}
        >
          <div>
            <label htmlFor="type" className="block font-medium mb-1 text-primary">
              Loại báo cáo
            </label>
            <select
              id="type"
              className="w-full border border-primary rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              value={type}
              onChange={handleTypeChange}
            >
              <option value="month">Theo tháng</option>
              <option value="quarter">Theo quý</option>
              <option value="year">Theo năm</option>
              <option value="custom">Tùy chọn</option>
            </select>
          </div>
          <div>
            <label htmlFor="timeInput" className="block font-medium mb-1 text-primary">
              {inputLabel}
            </label>
            <input
              id="timeInput"
              name="time"
              type={inputType}
              className="w-full border border-primary rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              value={time}
              onChange={handleTimeChange}
              placeholder={inputPlaceholder}
              min={type === "year" ? "2000" : undefined}
              max={type === "year" ? "2100" : undefined}
            />
          </div>
          <div className="md:col-span-1">
            <button
              type="submit"
              className="bg-primary hover:bg-primaryHover text-white font-semibold px-6 py-2 rounded transition w-full"
            >
              Xem báo cáo
            </button>
          </div>
        </form>

        {/* Thông báo lỗi */}
        {status === "error" && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-4">
            Lỗi kết nối đến cơ sở dữ liệu. Vui lòng thử lại sau.
          </div>
        )}
        {status === "nodata" && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded mb-4">
            Không có dữ liệu phù hợp cho thời gian đã chọn.
          </div>
        )}

        {/* Báo cáo tổng hợp */}
        {status === "success" && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="border rounded shadow-sm p-4 bg-gray-50">
                <h5 className="font-semibold mb-1">Tổng thu</h5>
                <p className="text-xl text-green-600 font-bold">{totalIncome}</p>
              </div>
              <div className="border rounded shadow-sm p-4 bg-gray-50">
                <h5 className="font-semibold mb-1">Tổng chi</h5>
                <p className="text-xl text-red-600 font-bold">{totalExpense}</p>
              </div>
              <div className="border rounded shadow-sm p-4 bg-gray-50">
                <h5 className="font-semibold mb-1">Lợi nhuận</h5>
                <p className="text-xl font-bold">{profit}</p>
              </div>
            </div>
            {/* Bảng chi tiết */}
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-t-lg shadow border-separate border-spacing-0">
                <thead>
                  <tr className="bg-primary text-white">
                    <th className="py-3 px-4 border-b-2 border-primary first:rounded-tl-lg last:rounded-tr-lg">Ngày</th>
                    <th className="py-3 px-4 border-b-2 border-primary">Thu</th>
                    <th className="py-3 px-4 border-b-2 border-primary">Chi</th>
                    <th className="py-3 px-4 border-b-2 border-primary last:rounded-tr-lg">Lợi nhuận</th>
                  </tr>
                </thead>
                <tbody>
                  {report.map((row, idx) => (
                    <tr key={idx} className="text-center hover:bg-primaryHover/10 transition">
                      <td className="py-2 px-4 border-b border-primary">{row.date}</td>
                      <td className="py-2 px-4 border-b border-primary">{row.income}</td>
                      <td className="py-2 px-4 border-b border-primary">{row.expense}</td>
                      <td className="py-2 px-4 border-b border-primary">{row.profit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </Layout>
  );
}