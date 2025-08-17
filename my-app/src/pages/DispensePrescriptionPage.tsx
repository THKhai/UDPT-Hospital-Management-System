import React, { useState } from "react";
import Layout from "../components/Layout";

const initialPrescriptions = [
  {
    id: "RX20250001",
    patient: "Nguyễn Văn A",
    date: "2025-07-10",
    doctor: "BS. Hoa",
    status: "Chưa cấp",
    diagnosis: "Viêm họng",
    notes: "Uống sau ăn sáng",
    drugs: ["Paracetamol 500mg - 10 viên", "Vitamin C - 5 viên"],
  },
  {
    id: "RX20250002",
    patient: "Trần Thị B",
    date: "2025-07-11",
    doctor: "BS. Hùng",
    status: "Hủy",
    diagnosis: "Cảm cúm",
    notes: "",
    drugs: ["Decolgen - 6 viên"],
  },
  {
    id: "RX20250003",
    patient: "Phạm Văn C",
    date: "2025-07-12",
    doctor: "BS. Minh",
    status: "Đã cấp",
    diagnosis: "Ho nhẹ",
    notes: "Uống sáng tối",
    drugs: ["Codein - 3 viên"],
  },
];

function DispensePrescriptionPage() {
  const [prescriptions, setPrescriptions] = useState(initialPrescriptions);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<typeof initialPrescriptions[0] | null>(null);

  const handleToggleDispense = (id: string) => {
    setPrescriptions((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status: p.status === "Đã cấp" ? "Hủy" : "Đã cấp",
            }
          : p
      )
    );
  };

  const handleViewDetail = (prescription: typeof initialPrescriptions[0]) => {
    setSelected(prescription);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelected(null);
  };

  return (
    <Layout>
      <main className="container mx-auto my-8 flex-1 px-2">
        <h2 className="text-center text-primary text-2xl font-bold mb-6">Danh sách đơn thuốc</h2>
        <div className="overflow-x-auto mb-8">
          <table className="min-w-full bg-white rounded-t-lg shadow border-separate border-spacing-0">
            <thead>
              <tr className="bg-primary text-white">
                <th className="py-3 px-4 border-b-2 border-primary first:rounded-tl-lg last:rounded-tr-lg">Mã đơn</th>
                <th className="py-3 px-4 border-b-2 border-primary">Bệnh nhân</th>
                <th className="py-3 px-4 border-b-2 border-primary">Ngày tạo</th>
                <th className="py-3 px-4 border-b-2 border-primary">Bác sĩ</th>
                <th className="py-3 px-4 border-b-2 border-primary">Trạng thái</th>
                <th className="py-3 px-4 border-b-2 border-primary">Hành động</th>
                <th className="py-3 px-4 border-b-2 border-primary last:rounded-tr-lg">Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {prescriptions.map((p) => {
                const isDispensed = p.status === "Đã cấp";
                return (
                  <tr key={p.id} className="text-center hover:bg-primaryHover/10 transition">
                    <td className="py-2 px-4 border-b border-primary">{p.id}</td>
                    <td className="py-2 px-4 border-b border-primary">{p.patient}</td>
                    <td className="py-2 px-4 border-b border-primary">{p.date}</td>
                    <td className="py-2 px-4 border-b border-primary">{p.doctor}</td>
                    <td className="py-2 px-4 border-b border-primary">
                      <span
                        className={
                          p.status === "Đã cấp"
                            ? "inline-block px-3 py-1 rounded-full bg-green-500 text-white text-xs font-semibold"
                            : p.status === "Hủy"
                            ? "inline-block px-3 py-1 rounded-full bg-red-500 text-white text-xs font-semibold"
                            : "inline-block px-3 py-1 rounded-full bg-yellow-400 text-white text-xs font-semibold"
                        }
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="py-2 px-4 border-b border-primary">
                      <button
                        className={`px-3 py-1 rounded text-sm font-medium transition ${
                          isDispensed
                            ? "bg-red-600 hover:bg-red-700 text-white"
                            : "bg-green-600 hover:bg-green-700 text-white"
                        }`}
                        onClick={() => handleToggleDispense(p.id)}
                      >
                        {isDispensed ? "Hủy cấp" : "Cấp thuốc"}
                      </button>
                    </td>
                    <td className="py-2 px-4 border-b border-primary">
                      <button
                        className="bg-primary hover:bg-primaryHover text-white px-3 py-1 rounded text-sm font-medium transition"
                        onClick={() => handleViewDetail(p)}
                      >
                        Chi tiết
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Modal chi tiết */}
        {modalOpen && selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl relative">
              <div className="flex justify-between items-center border-b px-6 py-4">
                <h5 className="text-lg font-bold">Chi tiết đơn thuốc</h5>
                <button
                  className="text-gray-500 hover:text-red-500 text-xl font-bold"
                  onClick={closeModal}
                  aria-label="Đóng"
                >
                  ×
                </button>
              </div>
              <div className="p-6">
                <p>
                  <strong>Mã đơn:</strong> {selected.id}
                </p>
                <p>
                  <strong>Bệnh nhân:</strong> {selected.patient}
                </p>
                <p>
                  <strong>Ngày kê:</strong> {selected.date}
                </p>
                <p>
                  <strong>Chẩn đoán:</strong> {selected.diagnosis}
                </p>
                <p>
                  <strong>Danh sách thuốc:</strong>
                </p>
                <ul className="list-disc list-inside mb-2">
                  {selected.drugs.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
                <p>
                  <strong>Ghi chú:</strong> {selected.notes || "Không có"}
                </p>
                <p>
                  <strong>Trạng thái hiện tại:</strong>{" "}
                  <span
                    className={
                      selected.status === "Đã cấp"
                        ? "inline-block px-3 py-1 rounded-full bg-green-500 text-white text-xs font-semibold"
                        : selected.status === "Hủy"
                        ? "inline-block px-3 py-1 rounded-full bg-red-500 text-white text-xs font-semibold"
                        : "inline-block px-3 py-1 rounded-full bg-yellow-400 text-white text-xs font-semibold"
                    }
                  >
                    {selected.status}
                  </span>
                </p>
              </div>
            </div>
            {/* Overlay click để đóng modal */}
            <div className="fixed inset-0" onClick={closeModal} />
          </div>
        )}
      </main>
    </Layout>
  );
}

export default DispensePrescriptionPage;