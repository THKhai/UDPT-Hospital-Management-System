import React, { useState } from "react";
import Layout from "../components/Layout";

type Prescription = {
  id: string;
  date: string;
  doctor: string;
  status: "Đang sử dụng" | "Đã hoàn tất";
  drugs: string[];
  note: string;
};

const prescriptions: Prescription[] = [
  {
    id: "RX20250718-001",
    date: "18/07/2025",
    doctor: "BS. Nguyễn Thị Hoa",
    status: "Đang sử dụng",
    drugs: [
      "Paracetamol 500mg – Uống sau ăn, ngày 3 lần",
      "Vitamin C 1000mg – Uống sáng",
    ],
    note: "Uống đủ nước và tái khám sau 5 ngày.",
  },
  {
    id: "RX20250701-004",
    date: "01/07/2025",
    doctor: "BS. Trần Văn B",
    status: "Đã hoàn tất",
    drugs: [
      "Amoxicillin 500mg – Uống sáng tối",
      "Ibuprofen 400mg – Khi đau",
    ],
    note: "Không uống khi đói.",
  },
];

export default function PrescriptionPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<Prescription | null>(null);

  const openModal = (pres: Prescription) => {
    setSelected(pres);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelected(null);
  };

  return (
    <Layout>
      <main className="container mx-auto my-8 flex-1 px-2">
        <h2 className="text-center text-primary text-2xl font-bold mb-6">
          Theo dõi đơn thuốc
        </h2>
        {/* Danh sách đơn thuốc */}
        <div className="overflow-x-auto mb-8">
          <table className="min-w-full bg-white rounded-t-lg shadow border-separate border-spacing-0">
            <thead>
              <tr className="bg-primary text-white">
                <th className="py-3 px-4 border-b-2 border-primary first:rounded-tl-lg">Mã đơn</th>
                <th className="py-3 px-4 border-b-2 border-primary">Ngày kê</th>
                <th className="py-3 px-4 border-b-2 border-primary">Bác sĩ</th>
                <th className="py-3 px-4 border-b-2 border-primary">Tình trạng</th>
                <th className="py-3 px-4 border-b-2 border-primary last:rounded-tr-lg">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {prescriptions.map((p) => (
                <tr key={p.id} className="text-center hover:bg-primaryHover/10 transition">
                  <td className="py-2 px-4 border-b border-primary">{p.id}</td>
                  <td className="py-2 px-4 border-b border-primary">{p.date}</td>
                  <td className="py-2 px-4 border-b border-primary">{p.doctor}</td>
                  <td className="py-2 px-4 border-b border-primary">
                    <span
                      className={
                        p.status === "Đang sử dụng"
                          ? "inline-block px-3 py-1 rounded-full bg-yellow-500 text-white text-xs font-semibold"
                          : "inline-block px-3 py-1 rounded-full bg-green-500 text-white text-xs font-semibold"
                      }
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b border-primary">
                    <button
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

        {/* Modal chi tiết đơn thuốc */}
        {modalOpen && selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl relative">
              <div className="flex justify-between items-center border-b px-6 py-4">
                <h5 className="text-lg font-bold" id="modalTitle">
                  Chi tiết đơn thuốc
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
                <p>
                  <strong>Mã đơn:</strong> {selected.id}
                </p>
                <p>
                  <strong>Bác sĩ:</strong> {selected.doctor}
                </p>
                <p>
                  <strong>Ngày kê:</strong> {selected.date}
                </p>
                <hr className="my-3" />
                <h6 className="font-semibold mb-2">Danh sách thuốc:</h6>
                <ul className="list-disc list-inside mb-3">
                  {selected.drugs.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
                <hr className="my-3" />
                <p>
                  <strong>Ghi chú:</strong> {selected.note}
                </p>
              </div>
              <div className="flex justify-end gap-2 border-t px-6 py-4">
                <button
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-6 py-2 rounded transition"
                  onClick={closeModal}
                >
                  Đóng
                </button>
              </div>
            </div>
            <div className="fixed inset-0" onClick={closeModal} />
          </div>
        )}
      </main>
    </Layout>
  );
}