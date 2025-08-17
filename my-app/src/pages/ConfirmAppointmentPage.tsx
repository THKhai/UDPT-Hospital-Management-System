import React, { useState } from "react";
import Layout from "../components/Layout";

const appointments = [
  {
    id: "L001",
    patient: "Nguyễn Văn A",
    doctor: "BS. Trần Văn B",
    time: "20/07/2025 09:00",
    detail: {
      dob: "01/01/1990",
      reason: "Đau bụng",
      note: "Không ăn sáng",
    },
  },
  {
    id: "L002",
    patient: "Trần Thị C",
    doctor: "BS. Nguyễn Thị D",
    time: "20/07/2025 10:30",
    detail: {
      dob: "15/05/1985",
      reason: "Khám sức khỏe tổng quát",
      note: "Mang kết quả xét nghiệm",
    },
  },
];

function ConfirmAppointmentPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<typeof appointments[0] | null>(null);

  const openModal = (appt: typeof appointments[0]) => {
    setSelected(appt);
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
          Danh sách lịch khám chờ xác nhận
        </h2>
        <div className="overflow-x-auto mb-8">
          <table className="min-w-full bg-white rounded-t-lg shadow border-separate border-spacing-0">
            <thead>
              <tr className="bg-primary text-white">
                <th className="py-3 px-4 border-b-2 border-primary first:rounded-tl-lg last:rounded-tr-lg">Mã lịch</th>
                <th className="py-3 px-4 border-b-2 border-primary">Bệnh nhân</th>
                <th className="py-3 px-4 border-b-2 border-primary">Bác sĩ</th>
                <th className="py-3 px-4 border-b-2 border-primary">Thời gian</th>
                <th className="py-3 px-4 border-b-2 border-primary"></th>
                <th className="py-3 px-4 border-b-2 border-primary last:rounded-tr-lg"></th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a.id} className="text-center hover:bg-primaryHover/10 transition">
                  <td className="py-2 px-4 border-b border-primary">{a.id}</td>
                  <td className="py-2 px-4 border-b border-primary">{a.patient}</td>
                  <td className="py-2 px-4 border-b border-primary">{a.doctor}</td>
                  <td className="py-2 px-4 border-b border-primary">{a.time}</td>
                  <td className="py-2 px-4 border-b border-primary">
                    <button
                      type="button"
                      className="bg-primary text-white px-3 py-1 rounded text-sm font-medium hover:bg-primaryHover transition"
                      onClick={() => openModal(a)}
                    >
                      Chi tiết
                    </button>
                  </td>
                  <td className="py-2 px-4 border-b border-primary space-x-2">
                    <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium transition">
                      Xác nhận
                    </button>
                    <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium transition">
                      Từ chối
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal chi tiết */}
        {modalOpen && selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
              <div className="flex justify-between items-center border-b px-6 py-4">
                <h5 className="text-lg font-bold">Chi tiết lịch khám</h5>
                <button
                  className="text-gray-500 hover:text-red-500 text-xl font-bold"
                  onClick={closeModal}
                  aria-label="Đóng"
                >
                  ×
                </button>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p>
                    <strong>Bệnh nhân:</strong> {selected.patient}
                  </p>
                  <p>
                    <strong>Ngày sinh:</strong> {selected.detail.dob}
                  </p>
                  <p>
                    <strong>Lý do khám:</strong> {selected.detail.reason}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Bác sĩ:</strong> {selected.doctor}
                  </p>
                  <p>
                    <strong>Thời gian:</strong> {selected.time}
                  </p>
                  <p>
                    <strong>Ghi chú:</strong> {selected.detail.note}
                  </p>
                </div>
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

export default ConfirmAppointmentPage;