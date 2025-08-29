import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";

type Slot = {
  slot_id: number;
  doctor_id: number;
  doctor_name: string;
  department_name: string;
  available_date: string;
  start_time: string;
  end_time: string;
};

type Department = {
  id: number;
  name: string;
  is_active: boolean;
  created_at: string;
};

const REASON_MIN_LEN = 6;

function BookingPage() {
  const [doctor, setDoctor] = useState("");
  const [slot, setSlot] = useState("");
  const [reason, setReason] = useState("");
  const [emergency, setEmergency] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  const [slots, setSlots] = useState<Slot[]>([]);
  const [doctors, setDoctors] = useState<{ id: number; name: string }[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  const isReasonValid = reason.trim().length >= REASON_MIN_LEN;

  // ✅ Fetch slots & departments
  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8005/appointments/available-slots", {
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error("Failed to load slots");
        const data: Slot[] = await res.json();
        setSlots(data);

        const uniqueDoctors = Array.from(
          new Map(
            data.map((s) => [s.doctor_id, { id: s.doctor_id, name: s.doctor_name }])
          ).values()
        );
        setDoctors(uniqueDoctors);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchDepartments = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8005/appointments/departments", {
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error("Failed to load departments");
        const data: Department[] = await res.json();
        setDepartments(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSlots();
    fetchDepartments();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!slot) {
      alert("Vui lòng chọn khung giờ!");
      return;
    }
    if (!isReasonValid) {
      alert(`Lý do khám phải có ít nhất ${REASON_MIN_LEN} ký tự.`);
      return;
    }

    const selectedSlot = slots.find((s) => s.slot_id === parseInt(slot));
    if (!selectedSlot) {
      alert("Slot không hợp lệ");
      return;
    }

    const department = departments.find(
      (d) => d.name.toLowerCase() === selectedSlot.department_name.toLowerCase()
    );

    const payload = {
      patient_id: 1,
      doctor_id: selectedSlot.doctor_id,
      department_id: department ? department.id : null,
      slot_id: selectedSlot.slot_id,
      reason: reason.trim(),
      is_emergency: emergency,
    };

    console.log("📌 Payload gửi:", payload);

    try {
      const res = await fetch("http://127.0.0.1:8005/appointments/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Đặt lịch thất bại");

      const data = await res.json();
      alert("Đặt lịch thành công!");
      console.log("Response:", data);
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra khi đặt lịch");
    }
  };

  // Lọc slot theo bác sĩ
  const filteredSlots = doctor
    ? slots.filter((s) => s.doctor_id === parseInt(doctor))
    : [];

  // Danh sách ngày khả dụng
  const availableDates = Array.from(new Set(filteredSlots.map((s) => s.available_date)));

  // Lọc slot theo ngày
  const slotsByDate = selectedDate
    ? filteredSlots.filter((s) => s.available_date === selectedDate)
    : [];

  return (
    <Layout>
      <main className="container mx-auto my-8 flex-1 px-2">
        <h2 className="text-center text-primary text-2xl font-bold mb-6">
          Đặt lịch khám
        </h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
          {/* Bác sĩ */}
          <div>
            <label htmlFor="doctor" className="block font-medium mb-1 text-primary">
              Chọn bác sĩ
            </label>
            <select
              id="doctor"
              className="w-full border border-primary rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              value={doctor}
              onChange={(e) => {
                setDoctor(e.target.value);
                setSlot("");
                setSelectedDate("");
              }}
              required
            >
              <option value="" disabled>-- Chọn bác sĩ --</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* Ngày */}
          <div>
            <label htmlFor="date" className="block font-medium mb-1 text-primary">
              Chọn ngày
            </label>
            <select
              id="date"
              className="w-full border border-primary rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setSlot("");
              }}
              required
              disabled={!doctor}
            >
              <option value="" disabled>-- Chọn ngày --</option>
              {availableDates.map((date) => (
                <option key={date} value={date}>{date}</option>
              ))}
            </select>
          </div>

          {/* Giờ */}
          <div className="md:col-span-2">
            <label htmlFor="slot" className="block font-medium mb-1 text-primary">
              Chọn khung giờ
            </label>
            <select
              id="slot"
              className="w-full border border-primary rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              value={slot}
              onChange={(e) => setSlot(e.target.value)}
              required
              disabled={!selectedDate}
            >
              <option value="" disabled>-- Chọn giờ --</option>
              {slotsByDate.map((s) => (
                <option key={s.slot_id} value={s.slot_id}>
                  {s.start_time} - {s.end_time} ({s.department_name})
                </option>
              ))}
            </select>
          </div>

          {/* Lý do khám (>= 6 ký tự) */}
          <div className="md:col-span-2">
            <label htmlFor="reason" className="block font-medium mb-1 text-primary">
              Lý do khám
            </label>
            <textarea
              id="reason"
              className={`w-full rounded px-3 py-2 focus:outline-none focus:ring-2 ${
                isReasonValid
                  ? "border border-primary focus:ring-primary"
                  : "border border-red-500 focus:ring-red-500"
              }`}
              rows={3}
              placeholder={`Nhập lý do khám (tối thiểu ${REASON_MIN_LEN} ký tự)`}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              minLength={REASON_MIN_LEN}
              required
              aria-invalid={!isReasonValid}
              aria-describedby="reason-help"
            />
            <p id="reason-help" className={`mt-1 text-sm ${isReasonValid ? "text-gray-500" : "text-red-600"}`}>
              {isReasonValid
                ? `Số ký tự hiện tại: ${reason.trim().length}`
                : `Cần ít nhất ${REASON_MIN_LEN} ký tự. Hiện có ${reason.trim().length}.`}
            </p>
          </div>

          {/* Khẩn cấp */}
          <div className="md:col-span-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox accent-primary mr-2"
                checked={emergency}
                onChange={(e) => setEmergency(e.target.checked)}
              />
              <span className="text-primary">Đặt lịch khẩn cấp</span>
            </label>
          </div>

          {/* Nút submit */}
          <div className="md:col-span-2 text-end">
            <button
              type="submit"
              className="bg-primary hover:bg-primaryHover text-white font-semibold px-6 py-2 rounded transition disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={!doctor || !selectedDate || !slot || !isReasonValid}
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
