import React, { useState } from "react";
import Layout from "../components/Layout";

const mockPatients = [
  {
    id: "BN20250001",
    name: "Nguyễn Văn A",
    dob: "01/01/1990",
    phone: "0912345678",
    gender: "Nam",
    cmnd: "123456789",
    email: "nguyena@example.com",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    insurance: "BHYT12345678",
    relative: { name: "Trần Văn B", relation: "Anh trai", phone: "0909123456" },
    history: [
      { date: "15/07/2025", department: "Khoa Nội", diagnosis: "Viêm dạ dày" },
      { date: "10/06/2025", department: "Khoa Hô hấp", diagnosis: "Viêm họng cấp" },
    ],
  },
  {
    id: "BN20250002",
    name: "Trần Thị B",
    dob: "15/06/1985",
    phone: "0909988776",
    gender: "Nữ",
    cmnd: "987654321",
    email: "tranb@example.com",
    address: "456 Đường XYZ, Quận 3, TP.HCM",
    insurance: "BHYT87654321",
    relative: { name: "Nguyễn Văn C", relation: "Chồng", phone: "0911223344" },
    history: [
      { date: "05/07/2025", department: "Khoa Sản", diagnosis: "Khám thai" },
    ],
  },
];

export default function PatientLookUpPage() {
  const [filters, setFilters] = useState({
    id: "",
    name: "",
    phone: "",
    cmnd: "",
  });
  const [searched, setSearched] = useState(false);
  const [results, setResults] = useState<typeof mockPatients>(mockPatients);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<typeof mockPatients[0] | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    let filtered = mockPatients.filter((p) =>
      (!filters.id || p.id.includes(filters.id)) &&
      (!filters.name || p.name.toLowerCase().includes(filters.name.toLowerCase())) &&
      (!filters.phone || p.phone.includes(filters.phone)) &&
      (!filters.cmnd || p.cmnd.includes(filters.cmnd))
    );
    setResults(filtered);
  };

  const openModal = (patient: typeof mockPatients[0]) => {
    setSelected(patient);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelected(null);
  };

  return (
    <Layout>
      <main className="container mx-auto my-8 flex-1 px-2">
        <h2 className="text-center text-primary text-2xl font-bold mb-6">Tra cứu bệnh nhân</h2>
        {/* Form tìm kiếm */}
        <form className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6" onSubmit={handleSearch}>
          <div className="md:col-span-3">
            <input
              type="text"
              name="id"
              className="w-full border border-primary rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Mã bệnh nhân"
              value={filters.id}
              onChange={handleChange}
            />
          </div>
          <div className="md:col-span-3">
            <input
              type="text"
              name="name"
              className="w-full border border-primary rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Họ tên"
              value={filters.name}
              onChange={handleChange}
            />
          </div>
          <div className="md:col-span-3">
            <input
              type="text"
              name="phone"
              className="w-full border border-primary rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Số điện thoại"
              value={filters.phone}
              onChange={handleChange}
            />
          </div>
          <div className="md:col-span-3">
            <input
              type="text"
              name="cmnd"
              className="w-full border border-primary rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="CMND/CCCD"
              value={filters.cmnd}
              onChange={handleChange}
            />
          </div>
          <div className="md:col-span-12 text-end">
            <button
              type="submit"
              className="bg-primary hover:bg-primaryHover text-white font-semibold px-6 py-2 rounded transition"
            >
              Tìm kiếm
            </button>
          </div>
        </form>

        {/* Kết quả tìm kiếm */}
        {searched && (
          <>
            <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded mb-4">
              {results.length > 0 ? (
                <>
                  Tìm thấy <strong>{results.length}</strong> kết quả phù hợp.
                </>
              ) : (
                <>Không tìm thấy bệnh nhân phù hợp.</>
              )}
            </div>
            {results.length > 0 && (
              <div className="overflow-x-auto mb-8">
                <table className="min-w-full bg-white rounded-t-lg shadow border-separate border-spacing-0">
                  <thead>
                    <tr className="bg-primary text-white">
                      <th className="py-3 px-4 border-b-2 border-primary first:rounded-tl-lg">Mã BN</th>
                      <th className="py-3 px-4 border-b-2 border-primary">Họ tên</th>
                      <th className="py-3 px-4 border-b-2 border-primary">Ngày sinh</th>
                      <th className="py-3 px-4 border-b-2 border-primary">SĐT</th>
                      <th className="py-3 px-4 border-b-2 border-primary last:rounded-tr-lg">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((p) => (
                      <tr key={p.id} className="text-center hover:bg-primaryHover/10 transition">
                        <td className="py-2 px-4 border-b border-primary">{p.id}</td>
                        <td className="py-2 px-4 border-b border-primary">{p.name}</td>
                        <td className="py-2 px-4 border-b border-primary">{p.dob}</td>
                        <td className="py-2 px-4 border-b border-primary">{p.phone}</td>
                        <td className="py-2 px-4 border-b border-primary">
                          <button
                            type="button"
                            className="bg-primary hover:bg-primaryHover text-white px-3 py-1 rounded text-sm font-medium transition"
                            onClick={() => openModal(p)}
                          >
                            Xem chi tiết
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* Modal Thông tin chi tiết bệnh nhân */}
        {modalOpen && selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl relative">
              <div className="flex justify-between items-center border-b px-6 py-4">
                <h5 className="text-lg font-bold">
                  Thông tin chi tiết bệnh nhân: <strong>{selected.name}</strong>
                </h5>
                <button
                  className="text-gray-500 hover:text-red-500 text-xl font-bold"
                  onClick={closeModal}
                  aria-label="Đóng"
                >
                  ×
                </button>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p>
                      <strong>Họ tên:</strong> {selected.name}
                    </p>
                    <p>
                      <strong>Ngày sinh:</strong> {selected.dob}
                    </p>
                    <p>
                      <strong>Giới tính:</strong> {selected.gender}
                    </p>
                    <p>
                      <strong>CMND/CCCD:</strong> {selected.cmnd}
                    </p>
                  </div>
                  <div>
                    <p>
                      <strong>Điện thoại:</strong> {selected.phone}
                    </p>
                    <p>
                      <strong>Email:</strong> {selected.email}
                    </p>
                    <p>
                      <strong>Địa chỉ:</strong> {selected.address}
                    </p>
                    <p>
                      <strong>Bảo hiểm:</strong> {selected.insurance}
                    </p>
                  </div>
                </div>
                <div className="mb-4">
                  <h5 className="font-semibold mb-2">Người thân liên hệ</h5>
                  <p>
                    <strong>Tên:</strong> {selected.relative.name}
                  </p>
                  <p>
                    <strong>Quan hệ:</strong> {selected.relative.relation}
                  </p>
                  <p>
                    <strong>Số điện thoại:</strong> {selected.relative.phone}
                  </p>
                </div>
                <div>
                  <h5 className="font-semibold mb-2">Lịch sử khám gần nhất</h5>
                  <ul className="list-disc list-inside">
                    {selected.history.map((h, idx) => (
                      <li key={idx}>
                        {h.date} - {h.department} - Chẩn đoán: {h.diagnosis}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="fixed inset-0" onClick={closeModal} />
          </div>
        )}
      </main>
    </Layout>
  );
}