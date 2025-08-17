import React, { useState } from "react";
import Layout from "../components/Layout";

const mockResults = [
  {
    date: "15/07/2025",
    doctor: "BS. Trần Minh",
    department: "Nội tổng quát",
    diagnosis: "Viêm dạ dày",
    prescription: "Omeprazol 20mg, uống 1 viên/ngày",
    test: "Không",
  },
  {
    date: "10/06/2025",
    doctor: "BS. Lê Hà",
    department: "Hô hấp",
    diagnosis: "Viêm họng cấp",
    prescription: "Clarithromycin 500mg",
    test: "Có",
  },
];

export default function MedicalHistoryPage() {
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const [result, setResult] = useState({
    found: true,
    patient: { name: "Nguyễn Văn A", id: "BN20250001" },
    history: mockResults,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    // Giả lập tìm kiếm: nếu query rỗng thì không tìm thấy
    if (!query.trim()) {
      setResult({ found: false, patient: { name: "", id: "" }, history: [] });
      return;
    }
    // Nếu query không phải BN20250001 hoặc Nguyễn Văn A thì chưa có lịch sử
    if (
      query.trim() !== "BN20250001" &&
      query.trim().toLowerCase() !== "nguyễn văn a"
    ) {
      setResult({
        found: true,
        patient: { name: query, id: "BN_UNKNOWN" },
        history: [],
      });
      return;
    }
    // Có kết quả
    setResult({
      found: true,
      patient: { name: "Nguyễn Văn A", id: "BN20250001" },
      history: mockResults,
    });
  };

  return (
    <Layout>
      <main className="container mx-auto my-8 flex-1 px-2">
        <h2 className="text-center text-primary text-2xl font-bold mb-6">
          Tra cứu lịch sử khám bệnh
        </h2>
        {/* Form tìm kiếm */}
        <form className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6" onSubmit={handleSearch}>
          <div className="md:col-span-9">
            <input
              type="text"
              className="w-full border border-primary rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Nhập mã BN hoặc họ tên"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
          <div className="md:col-span-3">
            <button
              type="submit"
              className="w-full bg-primary hover:bg-primaryHover text-white font-semibold px-6 py-2 rounded transition"
            >
              Tìm kiếm
            </button>
          </div>
        </form>

        {/* Kết quả tìm kiếm */}
        {searched && !result.found && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-4">
            Không tìm thấy bệnh nhân
          </div>
        )}
        {searched && result.found && (
          <>
            <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded mb-4">
              Kết quả cho bệnh nhân:{" "}
              <strong>
                {result.patient.name} ({result.patient.id})
              </strong>
            </div>
            {result.history.length === 0 ? (
              <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded mb-4">
                Bệnh nhân chưa có lịch sử khám chữa bệnh
              </div>
            ) : (
              <>
                {/* Lịch sử khám */}
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white rounded-t-lg shadow border-separate border-spacing-0">
                    <thead>
                      <tr className="bg-primary text-white">
                        <th className="py-3 px-4 border-b-2 border-primary first:rounded-tl-lg last:rounded-tr-lg">
                          Ngày khám
                        </th>
                        <th className="py-3 px-4 border-b-2 border-primary">Bác sĩ khám</th>
                        <th className="py-3 px-4 border-b-2 border-primary">Khoa</th>
                        <th className="py-3 px-4 border-b-2 border-primary">Chẩn đoán</th>
                        <th className="py-3 px-4 border-b-2 border-primary">Đơn thuốc</th>
                        <th className="py-3 px-4 border-b-2 border-primary">Xét nghiệm</th>
                        <th className="py-3 px-4 border-b-2 border-primary last:rounded-tr-lg"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.history.map((h, idx) => (
                        <tr key={idx} className="text-center hover:bg-primaryHover/10 transition">
                          <td className="py-2 px-4 border-b border-primary">{h.date}</td>
                          <td className="py-2 px-4 border-b border-primary">{h.doctor}</td>
                          <td className="py-2 px-4 border-b border-primary">{h.department}</td>
                          <td className="py-2 px-4 border-b border-primary">{h.diagnosis}</td>
                          <td className="py-2 px-4 border-b border-primary">{h.prescription}</td>
                          <td className="py-2 px-4 border-b border-primary">{h.test}</td>
                          <td className="py-2 px-4 border-b border-primary">
                            <button className="bg-primary hover:bg-primaryHover text-white px-3 py-1 rounded text-sm font-medium transition">
                              Chi tiết
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Nút in/xuất */}
                <div className="text-end mt-4 space-x-2">
                  <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-6 py-2 rounded transition">
                    🖨️ In
                  </button>
                  <button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded transition">
                    ⬇️ Xuất PDF
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </main>
    </Layout>
  );
}