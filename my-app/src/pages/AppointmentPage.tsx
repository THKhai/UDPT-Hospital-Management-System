import React from "react";
import Layout from "../components/Layout";

const reminders = [
  {
    id: "APPT20250719",
    patient: "Nguyễn Văn A",
    datetime: "2025-07-19 08:30",
    doctor: "BS. Hùng",
    room: "Phòng 203",
    method: "Email",
    status: "Đã gửi",
  },
  {
    id: "APPT20250719B",
    patient: "Trần Thị B",
    datetime: "2025-07-19 09:15",
    doctor: "BS. Hoa",
    room: "Phòng 105",
    method: "App",
    status: "Đã gửi",
  },
  {
    id: "APPT20250719C",
    patient: "Lê Văn C",
    datetime: "2025-07-19 10:00",
    doctor: "BS. Minh",
    room: "Phòng 301",
    method: "SMS",
    status: "Đã gửi",
  },
];

function AppointmentPage() {
  return (
    <Layout>
      <main className="container mx-auto my-8 flex-1 px-2">
        <h2 className="text-center text-primary text-2xl font-bold mb-6">
          Lịch khám sắp diễn ra
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-t-lg shadow border-separate border-spacing-0">
            <thead>
              <tr className="bg-primary text-white rounded-t-lg">
                <th className="py-3 px-4 border-b-2 border-primary first:rounded-tl-lg last:rounded-tr-lg">Mã lịch</th>
                <th className="py-3 px-4 border-b-2 border-primary">Bệnh nhân</th>
                <th className="py-3 px-4 border-b-2 border-primary">Ngày giờ khám</th>
                <th className="py-3 px-4 border-b-2 border-primary">Bác sĩ</th>
                <th className="py-3 px-4 border-b-2 border-primary">Phòng khám</th>
                <th className="py-3 px-4 border-b-2 border-primary">Phương thức nhắc</th>
                <th className="py-3 px-4 border-b-2 border-primary last:rounded-tr-lg">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {reminders.map((r) => (
                <tr
                  key={r.id}
                  className="text-center hover:bg-primary-hover/10 transition"
                >
                  <td className="py-2 px-4 border-b border-primary">{r.id}</td>
                  <td className="py-2 px-4 border-b border-primary">{r.patient}</td>
                  <td className="py-2 px-4 border-b border-primary">{r.datetime}</td>
                  <td className="py-2 px-4 border-b border-primary">{r.doctor}</td>
                  <td className="py-2 px-4 border-b border-primary">{r.room}</td>
                  <td className="py-2 px-4 border-b border-primary">{r.method}</td>
                  <td className="py-2 px-4 border-b border-primary">
                    <span className="inline-block px-3 py-1 rounded-full bg-green-500 text-white text-xs font-semibold">
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </Layout>
  );
}

export default AppointmentPage;