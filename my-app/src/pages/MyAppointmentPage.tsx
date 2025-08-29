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
  rejection_reason?: string;
  cancellation_reason?: string;
  created_at: string;
  updated_at: string;
  slot_id?: number;
  confirmed_by?: number;
  confirmed_at?: string;
  rejected_at?: string;
  cancelled_by?: string;
  cancelled_at?: string;
};

type Slot = {
  slot_id: number;
  doctor_id: number;
  doctor_name: string;
  department_name: string;
  available_date: string;
  start_time: string;
  end_time: string;
};

const REASON_MIN_LEN = 6;

function MyAppointmentPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selected, setSelected] = useState<Appointment | null>(null);

  // State cho chỉnh sửa
  const [doctor, setDoctor] = useState("");
  const [slot, setSlot] = useState("");
  const [reason, setReason] = useState("");
  const [emergency, setEmergency] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  const [slots, setSlots] = useState<Slot[]>([]);
  const [doctors, setDoctors] = useState<{ id: number; name: string }[]>([]);

  // state cho cancel
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const isReasonValid = reason.trim().length >= REASON_MIN_LEN;
  const patientId = 1; // giả sử lấy từ session

  // Fetch danh sách lịch khám
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:8005/appointments/patient/${patientId}`,
          { headers: { Accept: "application/json" } }
        );
        if (!res.ok) throw new Error("Failed to fetch appointments");
        const data = await res.json();
        setAppointments(data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAppointments();
  }, [patientId]);

  // Fetch slots khi mở modal edit
  useEffect(() => {
    if (editMode) {
      const fetchSlots = async () => {
        try {
          const res = await fetch(
            "http://127.0.0.1:8005/appointments/available-slots",
            { headers: { Accept: "application/json" } }
          );
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
      fetchSlots();
    }
  }, [editMode]);

  // mở modal và fetch chi tiết
  const openModal = async (appt: Appointment) => {
    try {
      const res = await fetch(`http://127.0.0.1:8005/appointments/${appt.id}`, {
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error("Failed to fetch appointment detail");
      const detail: Appointment = await res.json();
      setSelected(detail);
      setModalOpen(true);
      setEditMode(false);
    } catch (err) {
      console.error(err);
      alert("Không tải được chi tiết lịch khám");
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelected(null);
    setEditMode(false);
  };

  const startEdit = (appt: Appointment) => {
    setDoctor(appt.doctor_id.toString());
    setReason(appt.reason);
    setEmergency(appt.is_emergency);
    setSlot("");
    setSelectedDate("");
    setEditMode(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;

    if (!slot) {
      alert("Vui lòng chọn khung giờ!");
      return;
    }
    if (!isReasonValid) {
      alert(`Lý do khám phải có ít nhất ${REASON_MIN_LEN} ký tự.`);
      return;
    }

    try {
      const payload = {
        doctor_id: parseInt(doctor),
        slot_id: parseInt(slot),
        reason: reason.trim(),
        is_emergency: emergency,
      };

      const res = await fetch(
        `http://127.0.0.1:8005/appointments/${selected.id}?updated_by=${patientId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("Cập nhật lịch khám thất bại");

      const updated = await res.json();
      alert("Cập nhật thành công!");
      closeModal();

      setAppointments((prev) =>
        prev.map((a) => (a.id === selected.id ? { ...a, ...updated } : a))
      );
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra khi cập nhật");
    }
  };

  const handleCancel = async () => {
    if (!selected) return;
    if (!cancelReason.trim()) {
      alert("Vui lòng nhập lý do huỷ!");
      return;
    }
    try {
      const res = await fetch(
        `http://127.0.0.1:8005/appointments/${selected.id}/cancel?cancelled_by_user=${patientId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cancelled_by: "PATIENT",
            cancellation_reason: cancelReason.trim(),
          }),
        }
      );
      if (!res.ok) throw new Error("Huỷ lịch thất bại");
      alert("Đã huỷ lịch thành công!");

      setAppointments((prev) =>
        prev.map((a) =>
          a.id === selected.id
            ? { ...a, status: "CANCELLED", cancellation_reason: cancelReason }
            : a
        )
      );
      setCancelModalOpen(false);
      setCancelReason("");
      closeModal();
    } catch (err) {
      console.error(err);
      alert("Có lỗi khi huỷ lịch");
    }
  };

  // filter slot theo doctor và ngày
  const filteredSlots = doctor
    ? slots.filter((s) => s.doctor_id === parseInt(doctor))
    : [];
  const availableDates = Array.from(
    new Set(filteredSlots.map((s) => s.available_date))
  );
  const slotsByDate = selectedDate
    ? filteredSlots.filter((s) => s.available_date === selectedDate)
    : [];

  return (
    <Layout>
      <main className="container mx-auto my-8 flex-1 px-2">
        <h2 className="text-center text-primary text-2xl font-bold mb-6">
          Lịch khám của tôi
        </h2>
        <div className="overflow-x-auto mb-8">
          <table className="min-w-full bg-white rounded-t-lg shadow border-separate border-spacing-0">
            <thead>
              <tr className="bg-primary text-white">
                <th className="py-3 px-4 border-b-2 border-primary">Mã lịch</th>
                <th className="py-3 px-4 border-b-2 border-primary">Bác sĩ</th>
                <th className="py-3 px-4 border-b-2 border-primary">Khoa</th>
                <th className="py-3 px-4 border-b-2 border-primary">Thời gian</th>
                <th className="py-3 px-4 border-b-2 border-primary">Trạng thái</th>
                <th className="py-3 px-4 border-b-2 border-primary"></th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr
                  key={a.id}
                  className="text-center hover:bg-primaryHover/10 transition"
                >
                  <td className="py-2 px-4 border-b border-primary">{a.id}</td>
                  <td className="py-2 px-4 border-b border-primary">{a.doctor_name}</td>
                  <td className="py-2 px-4 border-b border-primary">{a.department_name}</td>
                  <td className="py-2 px-4 border-b border-primary">
                    {a.appointment_date} {a.appointment_time}
                  </td>
                  <td className="py-2 px-4 border-b border-primary">
                    {a.status === "PENDING" && (
                      <span className="text-yellow-600 font-semibold">Chờ xác nhận</span>
                    )}
                    {a.status === "CONFIRMED" && (
                      <span className="text-green-600 font-semibold">Đã xác nhận</span>
                    )}
                    {a.status === "REJECTED" && (
                      <span className="text-red-600 font-semibold">Bị từ chối</span>
                    )}
                    {a.status === "CANCELLED" && (
                      <span className="text-gray-600 font-semibold">Đã huỷ</span>
                    )}
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal chi tiết / chỉnh sửa */}
        {modalOpen && selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl relative z-10 p-6">
              <div className="flex justify-between items-center border-b pb-3">
                <h5 className="text-lg font-bold">
                  {editMode ? "Chỉnh sửa lịch khám" : "Chi tiết lịch khám"}
                </h5>
                <button
                  className="text-gray-500 hover:text-red-500 text-xl font-bold"
                  onClick={closeModal}
                >
                  ×
                </button>
              </div>

              {!editMode ? (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p><strong>Bệnh nhân:</strong> {selected.patient_name}</p>
                    <p><strong>Lý do khám:</strong> {selected.reason}</p>
                    <p><strong>Khẩn cấp:</strong> {selected.is_emergency ? "Có" : "Không"}</p>
                    <p><strong>Trạng thái:</strong> {selected.status}</p>
                    {selected.status === "REJECTED" && (
                      <p className="text-red-600">
                        <strong>Lý do từ chối:</strong>{" "}
                        {selected.rejection_reason || "Không có"}
                      </p>
                    )}
                    {selected.status === "CANCELLED" && (
                      <p className="text-gray-600">
                        <strong>Lý do huỷ:</strong>{" "}
                        {selected.cancellation_reason || "Không có"}
                      </p>
                    )}
                  </div>
                  <div>
                    <p><strong>Bác sĩ:</strong> {selected.doctor_name}</p>
                    <p><strong>Khoa:</strong> {selected.department_name}</p>
                    <p>
                      <strong>Thời gian:</strong> {selected.appointment_date}{" "}
                      {selected.appointment_time}
                    </p>
                  </div>
                  {(selected.status === "PENDING" || selected.status === "CONFIRMED") && (
                    <div className="md:col-span-2 text-right space-x-2">
                      <button
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        onClick={() => startEdit(selected)}
                      >
                        Chỉnh sửa
                      </button>
                      <button
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                        onClick={() => setCancelModalOpen(true)}
                      >
                        Huỷ lịch
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <form
                  className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6"
                  onSubmit={handleUpdate}
                >
                  {/* Bác sĩ */}
                  <div>
                    <label className="block font-medium mb-1 text-primary">
                      Chọn bác sĩ
                    </label>
                    <select
                      value={doctor}
                      onChange={(e) => {
                        setDoctor(e.target.value);
                        setSlot("");
                        setSelectedDate("");
                      }}
                      className="w-full border rounded px-3 py-2"
                      required
                    >
                      <option value="" disabled>
                        -- Chọn bác sĩ --
                      </option>
                      {doctors.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Ngày */}
                  <div>
                    <label className="block font-medium mb-1 text-primary">
                      Chọn ngày
                    </label>
                    <select
                      value={selectedDate}
                      onChange={(e) => {
                        setSelectedDate(e.target.value);
                        setSlot("");
                      }}
                      className="w-full border rounded px-3 py-2"
                      required
                      disabled={!doctor}
                    >
                      <option value="" disabled>
                        -- Chọn ngày --
                      </option>
                      {availableDates.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Slot */}
                  <div className="md:col-span-2">
                    <label className="block font-medium mb-1 text-primary">
                      Chọn khung giờ
                    </label>
                    <select
                      value={slot}
                      onChange={(e) => setSlot(e.target.value)}
                      className="w-full border rounded px-3 py-2"
                      required
                      disabled={!selectedDate}
                    >
                      <option value="" disabled>
                        -- Chọn giờ --
                      </option>
                      {slotsByDate.map((s) => (
                        <option key={s.slot_id} value={s.slot_id}>
                          {s.start_time} - {s.end_time} ({s.department_name})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Lý do */}
                  <div className="md:col-span-2">
                    <label className="block font-medium mb-1 text-primary">
                      Lý do khám
                    </label>
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className={`w-full rounded px-3 py-2 border ${
                        isReasonValid ? "border-primary" : "border-red-500"
                      }`}
                      minLength={REASON_MIN_LEN}
                      required
                    />
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
                      <span>Đặt lịch khẩn cấp</span>
                    </label>
                  </div>

                  <div className="md:col-span-2 text-right space-x-2">
                    <button
                      type="button"
                      className="bg-gray-400 px-4 py-2 rounded hover:bg-gray-500"
                      onClick={() => setEditMode(false)}
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      disabled={!doctor || !selectedDate || !slot || !isReasonValid}
                    >
                      Lưu thay đổi
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Modal huỷ lịch */}
        {cancelModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
              <h5 className="text-lg font-bold mb-4">Xác nhận huỷ lịch</h5>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full border rounded px-3 py-2 mb-4"
                placeholder="Nhập lý do huỷ..."
              />
              <div className="text-right space-x-2">
                <button
                  className="bg-gray-400 px-4 py-2 rounded hover:bg-gray-500"
                  onClick={() => setCancelModalOpen(false)}
                >
                  Đóng
                </button>
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  onClick={handleCancel}
                >
                  Xác nhận huỷ
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </Layout>
  );
}

export default MyAppointmentPage;
