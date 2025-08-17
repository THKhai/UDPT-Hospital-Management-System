import React, { useState } from "react";
import Layout from "../components/Layout";

// Giả lập danh sách bệnh nhân và bác sĩ
const patientOptions = [
  { id: "BN001", name: "Nguyễn Văn A" },
  { id: "BN002", name: "Trần Thị B" },
  { id: "BN003", name: "Lê Văn C" },
];
const doctorOptions = [
  "BS. Nguyễn Thị Hoa",
  "BS. Trần Văn B",
  "BS. Lê Văn C",
];

// Giả lập danh sách thuốc
const medicineOptions = [
  "Paracetamol 500mg",
  "Amoxicillin 500mg",
  "Vitamin C 1000mg",
  "Ibuprofen 400mg",
];

function CreatePrescription() {
  const [patientId, setPatientId] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [prescriptionDate, setPrescriptionDate] = useState("");
  const [medicines, setMedicines] = useState([{ name: "", quantity: "" }]);
  const [notes, setNotes] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);
  const [showDoctorDropdown, setShowDoctorDropdown] = useState(false);

  // Tìm kiếm bệnh nhân
  const filteredPatients = patientOptions.filter(
    (p) =>
      p.id.toLowerCase().includes(patientId.toLowerCase()) ||
      p.name.toLowerCase().includes(patientId.toLowerCase())
  );

  // Tìm kiếm bác sĩ
  const filteredDoctors = doctorOptions.filter((d) =>
    d.toLowerCase().includes(doctorName.toLowerCase())
  );

  // Xử lý thêm thuốc
  const handleAddMedicine = () => {
    setMedicines([...medicines, { name: "", quantity: "" }]);
  };

  // Xử lý thay đổi thuốc
  const handleMedicineChange = (idx: number, field: "name" | "quantity", value: string) => {
    const newMedicines = medicines.map((m, i) =>
      i === idx ? { ...m, [field]: value } : m
    );
    setMedicines(newMedicines);
  };

  // Xử lý xóa thuốc
  const handleRemoveMedicine = (idx: number) => {
    setMedicines(medicines.filter((_, i) => i !== idx));
  };

  // Xử lý submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !patientId ||
      !doctorName ||
      !prescriptionDate ||
      medicines.some((m) => !m.name || !m.quantity)
    ) {
      setSuccessMsg("");
      return;
    }
    setSuccessMsg(`✅ Đã lưu đơn thuốc thành công cho bệnh nhân ${patientId}.`);
    setPatientId("");
    setDoctorName("");
    setPrescriptionDate("");
    setMedicines([{ name: "", quantity: "" }]);
    setNotes("");
  };

  return (
    <Layout>
      <main className="container mx-auto my-8 flex-1 px-2">
        <h2 className="mb-6 text-center text-2xl font-bold text-primary">Tạo đơn thuốc mới</h2>
        {successMsg && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded mb-6 text-center">
            {successMsg}
          </div>
        )}
        <form
          className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow"
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          {/* Mã bệnh nhân */}
          <div className="mb-4 relative">
            <label htmlFor="patientId" className="block font-medium mb-1 text-primary">
              Mã bệnh nhân
            </label>
            <input
              type="text"
              id="patientId"
              className="w-full border border-primary rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              value={patientId}
              onChange={e => {
                setPatientId(e.target.value);
                setShowPatientDropdown(true);
              }}
              onFocus={() => setShowPatientDropdown(true)}
              onBlur={() => setTimeout(() => setShowPatientDropdown(false), 100)}
              autoComplete="off"
              required
            />
            {showPatientDropdown && patientId && filteredPatients.length > 0 && (
              <ul className="absolute z-10 bg-white border border-primary w-full rounded mt-1 max-h-40 overflow-y-auto">
                {filteredPatients.map((p) => (
                  <li
                    key={p.id}
                    className="px-3 py-1 hover:bg-primary/10 cursor-pointer"
                    onMouseDown={() => {
                      setPatientId(p.id);
                      setShowPatientDropdown(false);
                    }}
                  >
                    {p.id} - {p.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* Bác sĩ kê đơn */}
          <div className="mb-4 relative">
            <label htmlFor="doctorName" className="block font-medium mb-1 text-primary">
              Bác sĩ kê đơn
            </label>
            <input
              type="text"
              id="doctorName"
              className="w-full border border-primary rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              value={doctorName}
              onChange={e => {
                setDoctorName(e.target.value);
                setShowDoctorDropdown(true);
              }}
              onFocus={() => setShowDoctorDropdown(true)}
              onBlur={() => setTimeout(() => setShowDoctorDropdown(false), 100)}
              autoComplete="off"
              required
            />
            {showDoctorDropdown && doctorName && filteredDoctors.length > 0 && (
              <ul className="absolute z-10 bg-white border border-primary w-full rounded mt-1 max-h-40 overflow-y-auto">
                {filteredDoctors.map((d) => (
                  <li
                    key={d}
                    className="px-3 py-1 hover:bg-primary/10 cursor-pointer"
                    onMouseDown={() => {
                      setDoctorName(d);
                      setShowDoctorDropdown(false);
                    }}
                  >
                    {d}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* Ngày kê */}
          <div className="mb-4">
            <label htmlFor="prescriptionDate" className="block font-medium mb-1 text-primary">
              Ngày kê
            </label>
            <input
              type="date"
              id="prescriptionDate"
              className="w-full border border-primary rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              value={prescriptionDate}
              onChange={e => setPrescriptionDate(e.target.value)}
              required
            />
          </div>
          {/* Danh sách thuốc */}
          <div className="mb-4">
            <label className="block font-medium mb-1 text-primary">
              Danh sách thuốc
            </label>
            {medicines.map((med, idx) => (
              <div key={idx} className="flex gap-2 mb-2 items-center">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    className="w-full border border-primary rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Tên thuốc"
                    value={med.name}
                    onChange={e => handleMedicineChange(idx, "name", e.target.value)}
                    list={`medicine-list-${idx}`}
                    autoComplete="off"
                    required
                  />
                  <datalist id={`medicine-list-${idx}`}>
                    {medicineOptions
                      .filter((m) =>
                        m.toLowerCase().includes(med.name.toLowerCase())
                      )
                      .map((m) => (
                        <option key={m} value={m} />
                      ))}
                  </datalist>
                </div>
                <div className="w-28">
                  <input
                    type="number"
                    min={1}
                    className="w-full border border-primary rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Số lượng"
                    value={med.quantity}
                    onChange={e => handleMedicineChange(idx, "quantity", e.target.value)}
                    required
                  />
                </div>
                {medicines.length > 1 && (
                  <button
                    type="button"
                    className="ml-1 px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded transition"
                    onClick={() => handleRemoveMedicine(idx)}
                    tabIndex={-1}
                  >
                    X
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="mt-2 bg-primary hover:bg-primaryHover text-white px-4 py-1 rounded transition"
              onClick={handleAddMedicine}
            >
              + Thêm thuốc
            </button>
          </div>
          {/* Ghi chú */}
          <div className="mb-4">
            <label htmlFor="notes" className="block font-medium mb-1 text-primary">
              Ghi chú (nếu có)
            </label>
            <textarea
              id="notes"
              className="w-full border border-primary rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              rows={3}
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
          </div>
          <div className="text-end">
            <button
              type="submit"
              className="bg-primary hover:bg-primaryHover text-white font-semibold px-6 py-2 rounded transition"
            >
              Lưu đơn thuốc
            </button>
          </div>
        </form>
      </main>
    </Layout>
  );
}

export default CreatePrescription;