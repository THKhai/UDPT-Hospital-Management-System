import React, { useState } from "react";
import Layout from "../components/Layout";

function BookingPage() {
  const [department, setDepartment] = useState("");
  const [doctor, setDoctor] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");
  const [emergency, setEmergency] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Xử lý đặt lịch ở đây
  };

  return (
    <Layout>
      <main className="container mx-auto my-8 flex-1 px-2">
        <h2 className="text-center text-primary text-2xl font-bold mb-6">Đặt lịch khám</h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
          {/* Khoa khám */}
          <div>
            <label htmlFor="department" className="block font-medium mb-1 text-primary">
              Chọn khoa khám
            </label>
            <select
              id="department"
              className="w-full border border-primary rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              value={department}
              onChange={e => setDepartment(e.target.value)}
              required
            >
              <option value="" disabled>-- Chọn khoa --</option>
              <option>Nội tổng quát</option>
              <option>Ngoại thần kinh</option>
              <option>Sản phụ khoa</option>
              <option>Nhi</option>
              <option>Da liễu</option>
            </select>
          </div>
          {/* Bác sĩ */}
          <div>
            <label htmlFor="doctor" className="block font-medium mb-1 text-primary">
              Chọn bác sĩ
            </label>
            <select
              id="doctor"
              className="w-full border border-primary rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              value={doctor}
              onChange={e => setDoctor(e.target.value)}
              required
            >
              <option value="" disabled>-- Chọn bác sĩ --</option>
              <option>BS. Nguyễn Văn A</option>
              <option>BS. Trần Thị B</option>
              <option>BS. Lê Văn C</option>
            </select>
          </div>
          {/* Ngày khám */}
          <div>
            <label htmlFor="date" className="block font-medium mb-1 text-primary">
              Chọn ngày
            </label>
            <input
              type="date"
              id="date"
              className="w-full border border-primary rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
            />
          </div>
          {/* Giờ khám */}
          <div>
            <label htmlFor="time" className="block font-medium mb-1 text-primary">
              Chọn giờ
            </label>
            <select
              id="time"
              className="w-full border border-primary rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              value={time}
              onChange={e => setTime(e.target.value)}
              required
            >
              <option value="" disabled>-- Chọn giờ --</option>
              <option>08:00</option>
              <option>09:30</option>
              <option>10:45</option>
              <option>14:00</option>
              <option>15:15</option>
            </select>
          </div>
          {/* Lý do khám */}
          <div className="md:col-span-2">
            <label htmlFor="reason" className="block font-medium mb-1 text-primary">
              Lý do khám
            </label>
            <textarea
              id="reason"
              className="w-full border border-primary rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              rows={3}
              placeholder="Nhập lý do khám..."
              value={reason}
              onChange={e => setReason(e.target.value)}
            />
          </div>
          {/* Đặt lịch khẩn cấp */}
          <div className="md:col-span-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox accent-primary mr-2"
                checked={emergency}
                onChange={e => setEmergency(e.target.checked)}
              />
              <span className="text-primary">Đặt lịch khẩn cấp</span>
            </label>
          </div>
          {/* Nút xác nhận */}
          <div className="md:col-span-2 text-end">
            <button
              type="submit"
              className="bg-primary hover:bg-primaryHover text-white font-semibold px-6 py-2 rounded transition"
            >
              Xác nhận đặt lịch
            </button>
          </div>
        </form>
      </main>
    </Layout>
  );
}

export default BookingPage;