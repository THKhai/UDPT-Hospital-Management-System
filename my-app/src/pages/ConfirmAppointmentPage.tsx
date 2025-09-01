import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";

type Appointment = {
  id: number;
  patient_id: number;
  patient_name: string;
  doctor_id: number;
  doctor_name: string;
  department_id: number;
  department_name: string;
  appointment_date: string;
  appointment_time: string;
  reason: string;
  is_emergency: boolean;
  status: string;
  created_at: string;
  updated_at: string;
};

function ConfirmAppointmentPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  // Giả sử doctor_id được lấy từ session (hoặc context)
  const doctorId = 1;

  // Fetch danh sách lịch hẹn
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8005/appointments/doctor/${doctorId}/pending`, {
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error("Failed to fetch appointments");
        const data = await res.json();
        setAppointments(data || []); // API trả về array, không phải {data: [...]}
      } catch (err) {
        console.error(err);
      }
    };
    fetchAppointments();
  }, [doctorId]);


  // API confirm/reject
  const handleAction = async (
    appt: Appointment,
    action: "confirm" | "reject",
    reason?: string
  ) => {
    try {
      const payload =
        action === "reject"
          ? {
            action: "reject",
            rejection_reason: reason && reason.trim() !== "" ? reason : "Không có lý do cụ thể",
          }
          : { action: "confirm" };
  
      const res = await fetch(
        `http://127.0.0.1:8005/appointments/${appt.id}/confirm?confirmed_by=${doctorId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
  
      if (!res.ok) {
        const errorMsg = await res.text();
        throw new Error(errorMsg || "Failed to update appointment");
      }
  
      // Gửi email thông báo cho bệnh nhân (tạm hardcode email)
      await fetch("http://127.0.0.1:8022/notifications/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: "chikhangbui@gmail.com", // sau này thay bằng appt.patient_email
          subject: action === "confirm" ? "Lịch khám đã được xác nhận" : "Lịch khám bị từ chối",
          text:
            action === "confirm"
              ? `Lịch khám của bạn vào ${appt.appointment_date} ${appt.appointment_time} đã được xác nhận.`
              : `Lịch khám của bạn vào ${appt.appointment_date} ${appt.appointment_time} đã bị từ chối. Lý do: ${reason && reason.trim() !== "" ? reason : "Không có lý do cụ thể"}`,
        }),
      });
  
      // Nếu API thành công thì xóa khỏi danh sách
      setAppointments((prev) => prev.filter((a) => a.id !== appt.id));
      setRejectModalOpen(false);
      setRejectionReason("");
    } catch (err) {
      console.error("Error updating appointment:", err);
    }
  };
  // ...existing code...


  const openModal = (appt: Appointment) => {
    setSelected(appt);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelected(null);
  };

  const openRejectModal = (appt: Appointment) => {
    setSelected(appt);
    setRejectModalOpen(true);
  };

  const closeRejectModal = () => {
    setRejectModalOpen(false);
    setSelected(null);
    setRejectionReason("");
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
                <th className="py-3 px-4 border-b-2 border-primary">Mã lịch</th>
                <th className="py-3 px-4 border-b-2 border-primary">Bệnh nhân</th>
                <th className="py-3 px-4 border-b-2 border-primary">Bác sĩ</th>
                <th className="py-3 px-4 border-b-2 border-primary">Khoa</th>
                <th className="py-3 px-4 border-b-2 border-primary">Thời gian</th>
                <th className="py-3 px-4 border-b-2 border-primary"></th>
                <th className="py-3 px-4 border-b-2 border-primary"></th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a.id} className="text-center hover:bg-primaryHover/10 transition">
                  <td className="py-2 px-4 border-b border-primary">{a.id}</td>
                  <td className="py-2 px-4 border-b border-primary">{a.patient_name}</td>
                  <td className="py-2 px-4 border-b border-primary">{a.doctor_name}</td>
                  <td className="py-2 px-4 border-b border-primary">{a.department_name}</td>
                  <td className="py-2 px-4 border-b border-primary">
                    {a.appointment_date} {a.appointment_time}
                  </td>
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
                    <button
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium transition"
                      onClick={() => handleAction(a, "confirm")}
                    >
                      Xác nhận
                    </button>
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium transition"
                      onClick={() => openRejectModal(a)}
                    >
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
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl relative z-10">
              <div className="flex justify-between items-center border-b px-6 py-4">
                <h5 className="text-lg font-bold">Chi tiết lịch khám</h5>
                <button
                  className="text-gray-500 hover:text-red-500 text-xl font-bold"
                  onClick={closeModal}
                >
                  ×
                </button>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p><strong>Bệnh nhân:</strong> {selected.patient_name}</p>
                  <p><strong>Lý do khám:</strong> {selected.reason}</p>
                  <p><strong>Khẩn cấp:</strong> {selected.is_emergency ? "Có" : "Không"}</p>
                </div>
                <div>
                  <p><strong>Bác sĩ:</strong> {selected.doctor_name}</p>
                  <p><strong>Khoa:</strong> {selected.department_name}</p>
                  <p><strong>Thời gian:</strong> {selected.appointment_date} {selected.appointment_time}</p>
                </div>
              </div>
            </div>
            <div className="fixed inset-0" onClick={closeModal} />
          </div>
        )}

        {/* Modal nhập lý do từ chối */}
        {rejectModalOpen && selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md relative z-10">
              <div className="flex justify-between items-center border-b px-6 py-4">
                <h5 className="text-lg font-bold">Nhập lý do từ chối</h5>
                <button
                  className="text-gray-500 hover:text-red-500 text-xl font-bold"
                  onClick={closeRejectModal}
                >
                  ×
                </button>
              </div>
              <div className="p-6 space-y-4">
                <textarea
                  className="w-full border rounded p-2"
                  rows={4}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Nhập lý do từ chối..."
                />
                <div className="flex justify-end space-x-2">
                  <button
                    className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
                    onClick={closeRejectModal}
                  >
                    Hủy
                  </button>
                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    onClick={() => selected && handleAction(selected, "reject", rejectionReason)}
                  >
                    Xác nhận từ chối
                  </button>
                </div>
              </div>
            </div>
            <div className="fixed inset-0" onClick={closeRejectModal} />
          </div>
        )}
      </main>
    </Layout>
  );
}

export default ConfirmAppointmentPage;
