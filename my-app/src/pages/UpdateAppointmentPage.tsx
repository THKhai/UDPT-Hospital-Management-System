import React, { useState } from "react";
import Layout from "../components/Layout";

const doctorOptions = [
  "BS. Trần Văn B (Nội)",
  "BS. Nguyễn Thị C (Nội)",
  "BS. Lê Văn D (Nội)",
];

export default function UpdateAppointmentPage() {
  // Dữ liệu mẫu
  const [form, setForm] = useState({
    appointmentId: "LK20250001",
    patientName: "Nguyễn Văn A",
    appointmentDate: "2025-07-20T09:00",
    doctor: doctorOptions[0],
  });
  const [status, setStatus] = useState<"none" | "success" | "error">("none");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Giả lập thành công nếu chọn đúng định dạng, lỗi nếu để trống
    if (!form.appointmentDate || !form.doctor) {
      setStatus("error");
      return;
    }
    setStatus("success");
  };

  return (
    <Layout>
      <main className="container mx-auto my-8 flex-1 px-2">
        <h2 className="text-center text-primary text-2xl font-bold mb-6">
          Cập nhật lịch khám
        </h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="appointmentId" className="block font-medium mb-1 text-primary">
              Mã lịch khám
            </label>
            <input
              type="text"
              className="w-full border border-primary rounded px-3 py-2 bg-gray-100"
              id="appointmentId"
              name="appointmentId"
              value={form.appointmentId}
              disabled
            />
          </div>
          <div>
            <label htmlFor="patientName" className="block font-medium mb-1 text-primary">
              Tên bệnh nhân
            </label>
            <input
              type="text"
              className="w-full border border-primary rounded px-3 py-2 bg-gray-100"
              id="patientName"
              name="patientName"
              value={form.patientName}
              disabled
            />
          </div>
          <div>
            <label htmlFor="appointmentDate" className="block font-medium mb-1 text-primary">
              Thời gian khám
            </label>
            <input
              type="datetime-local"
              className="w-full border border-primary rounded px-3 py-2"
              id="appointmentDate"
              name="appointmentDate"
              value={form.appointmentDate}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="doctor" className="block font-medium mb-1 text-primary">
              Bác sĩ phụ trách
            </label>
            <select
              className="w-full border border-primary rounded px-3 py-2"
              id="doctor"
              name="doctor"
              value={form.doctor}
              onChange={handleChange}
              required
            >
              {doctorOptions.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2 text-end">
            <button
              type="submit"
              className="bg-primary hover:bg-primaryHover text-white font-semibold px-6 py-2 rounded transition"
            >
              Cập nhật
            </button>
          </div>
        </form>
        {/* Thông báo kết quả */}
        {status === "success" && (
          <div className="mt-6 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded text-center">
            Lịch khám đã được cập nhật thành công.
          </div>
        )}
        {status === "error" && (
          <div className="mt-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded text-center">
            Không thể cập nhật. Vui lòng kiểm tra thông tin nhập vào hoặc chọn thời gian khác.
          </div>
        )}
      </main>
    </Layout>
  );
}