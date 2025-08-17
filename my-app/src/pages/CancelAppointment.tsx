import React, { useState } from "react";
import Layout from "../components/Layout";

function CancelAppointment() {
  // Giả lập dữ liệu lịch khám
  const appointment = {
    id: "LK20250001",
    patient: "Nguyễn Văn A",
    doctor: "BS. Trần Văn B",
    datetime: "2025-07-20T09:00:00",
    displayTime: "20/07/2025 - 09:00",
  };

  const [reason, setReason] = useState("");
  const [status, setStatus] = useState<"success" | "error" | "late" | "">("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Kiểm tra thời gian hiện tại và thời gian khám
    const now = new Date();
    const appointmentTime = new Date(appointment.datetime);
    const diffHours = (appointmentTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (diffHours < 2) {
      setStatus("late");
      return;
    }

    // Mô phỏng xử lý thành công hoặc lỗi
    if (Math.random() < 0.8) {
      setStatus("success");
    } else {
      setStatus("error");
    }
  };

  return (
    <Layout>
      <main className="container mx-auto my-8 flex-1 px-2">
        <h2 className="text-center text-red-600 text-2xl font-bold mb-6">Hủy lịch khám</h2>

        {/* Thông tin lịch khám */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-5">
            <h5 className="text-lg font-semibold mb-2">Lịch khám: {appointment.id}</h5>
            <p className="mb-1"><strong>Bệnh nhân:</strong> {appointment.patient}</p>
            <p className="mb-1"><strong>Bác sĩ:</strong> {appointment.doctor}</p>
            <p className="mb-1"><strong>Thời gian khám:</strong> {appointment.displayTime}</p>
            <p className="text-gray-500 mb-0 italic text-sm">
              * Bạn chỉ có thể hủy lịch trước 2 giờ so với thời gian khám.
            </p>
          </div>
        </div>

        {/* Form nhập lý do */}
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="mb-4">
            <label htmlFor="cancelReason" className="block font-medium mb-1 text-primary">
              Lý do hủy (tùy chọn)
            </label>
            <textarea
              id="cancelReason"
              className="w-full border border-primary rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              rows={3}
              placeholder="Nhập lý do nếu có..."
              value={reason}
              onChange={e => setReason(e.target.value)}
            />
          </div>

          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded mb-4">
            Bạn có chắc chắn muốn <strong>hủy lịch khám</strong> này? Hành động này không thể hoàn tác.
          </div>

          <div className="text-end">
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded transition"
            >
              Xác nhận hủy
            </button>
          </div>
        </form>

        {/* Kết quả xử lý */}
        {status === "success" && (
          <div className="mt-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded">
            Lịch khám đã được hủy thành công. Bác sĩ sẽ nhận được thông báo.
          </div>
        )}
        {status === "error" && (
          <div className="mt-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
            Hệ thống gặp lỗi khi xử lý yêu cầu. Vui lòng thử lại.
          </div>
        )}
        {status === "late" && (
          <div className="mt-4 bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded">
            Không thể hủy lịch trong thời gian này. Vui lòng liên hệ trực tiếp với bệnh viện.
          </div>
        )}
      </main>
    </Layout>
  );
}

export default CancelAppointment;