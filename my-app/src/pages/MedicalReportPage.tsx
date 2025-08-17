import React, { useState } from "react";
import Layout from "../components/Layout";

type StatRow = {
  name: string;
  count: number;
};

const mockData: StatRow[] = [
  { name: "Paracetamol 500mg", count: 125 },
  { name: "Amoxicillin 500mg", count: 98 },
  { name: "Vitamin C 1000mg", count: 73 },
];

export default function MedicalReportPage() {
  const [month, setMonth] = useState("");
  const [data, setData] = useState<StatRow[] | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    // Giả lập: nếu tháng là "2025-07" thì có dữ liệu, ngược lại không có
    if (month === "2025-07") {
      setData(mockData);
    } else {
      setData([]);
    }
  };

  return (
    <Layout>
      <main className="container mx-auto my-8 flex-1 px-2">
        <h2 className="text-center text-primary text-2xl font-bold mb-6">
          Thống kê tên thuốc theo tháng
        </h2>
        {/* Form chọn tháng */}
        <form className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6" onSubmit={handleSubmit}>
          <div className="md:col-span-4 md:col-start-5">
            <label htmlFor="monthSelect" className="block font-medium mb-1 text-primary">
              Chọn tháng:
            </label>
            <input
              type="month"
              id="monthSelect"
              className="w-full border border-primary rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              value={month}
              onChange={e => setMonth(e.target.value)}
              required
            />
          </div>
          <div className="md:col-span-12 text-center">
            <button
              type="submit"
              className="bg-primary hover:bg-primaryHover text-white font-semibold px-6 py-2 rounded transition mt-2"
            >
              Xem thống kê
            </button>
          </div>
        </form>

        {/* Thông báo nếu không có dữ liệu */}
        {searched && data && data.length === 0 && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded mb-4 text-center">
            Không có dữ liệu cho tháng này
          </div>
        )}

        {/* Bảng thống kê thuốc */}
        {data && data.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-t-lg shadow border-separate border-spacing-0">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="py-3 px-4 border-b-2 border-primary first:rounded-tl-lg">STT</th>
                  <th className="py-3 px-4 border-b-2 border-primary">Tên thuốc</th>
                  <th className="py-3 px-4 border-b-2 border-primary last:rounded-tr-lg">Số lần cấp phát</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, idx) => (
                  <tr key={row.name} className="text-center hover:bg-primaryHover/10 transition">
                    <td className="py-2 px-4 border-b border-primary">{idx + 1}</td>
                    <td className="py-2 px-4 border-b border-primary">{row.name}</td>
                    <td className="py-2 px-4 border-b border-primary">{row.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </Layout>
  );
}