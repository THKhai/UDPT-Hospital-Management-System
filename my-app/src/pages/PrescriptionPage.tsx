import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";

type PrescriptionItem = {
  item_id: string; // number from API, string for temp items
  medication_id: number;
  medication_name?: string; // Tên thuốc lấy từ API medicines
  quantity_prescribed: string;
  unit_prescribed: string;
  dose: string;
  frequency: string;
  duration: string;
  notes: string;
  created_at: string;
  updated_at: string;
};

type Prescription = {
  prescription_id: number; // Changed to number
  prescription_code: string;
  appointment_id: number; // Changed to number
  status: string;
  valid_from: string;
  valid_to: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  created_by: number; // Changed to number
  updated_by: number; // Changed to number
  items?: PrescriptionItem[];
  // Additional fields for display
  patient_name?: string;
  doctor_name?: string;
};

type AppointmentDetail = {
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
  slot_id: number;
  confirmed_by: number;
  confirmed_at: string;
  rejection_reason: string;
  rejected_at: string;
  cancelled_by: string;
  cancelled_at: string;
  cancellation_reason: string;
};

type DispenseItem = {
  prescription_item_id: number | string;
  quantity_dispensed: number;
  lot_number: string;
  expiry_date: string;
  notes: string;
  selected: boolean;
  prescription_item: PrescriptionItem;
};

type Meta = {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
};

type Medicine = {
  medication_id: number;
  medicine_name: string;
  generic_name: string;
  form: string;
  strength: string;
  unit: string;
  stock: string;
  is_active: boolean;
  expiry_date: string;
};

export default function PrescriptionPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);

  // Modal xem chi tiết
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selected, setSelected] = useState<Prescription | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedPrescription, setEditedPrescription] = useState<Prescription | null>(null);
  const [deletedItems, setDeletedItems] = useState<string[]>([]);

  // Modal cấp phát
  const [dispenseModalOpen, setDispenseModalOpen] = useState(false);
  const [dispensePrescription, setDispensePrescription] = useState<Prescription | null>(null);
  const [dispenseItems, setDispenseItems] = useState<DispenseItem[]>([]);
  const [dispenseNotes, setDispenseNotes] = useState("");
  const [dispensedBy, setDispensedBy] = useState("");
  const [loadingDispense, setLoadingDispense] = useState(false);

  // State cho danh sách thuốc
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [medicinesLoaded, setMedicinesLoaded] = useState(false);

  const fetchPrescriptions = async (page = 1, page_size = 10) => {
    try {
      const res = await fetch(`http://127.0.0.1:8011/prescriptions/?page=${page}&page_size=${page_size}`);
      const data = await res.json();

      // Fetch appointment details for each prescription to get patient and doctor names
      const prescriptionsWithNames = await Promise.all(
        data.data.map(async (prescription: Prescription) => {
          try {
            const appointmentRes = await fetch(`http://127.0.0.1:8005/appointments/${prescription.appointment_id}`);
            const appointmentData: AppointmentDetail = await appointmentRes.json();
            return {
              ...prescription,
              patient_name: appointmentData.patient_name,
              doctor_name: appointmentData.doctor_name,
            };
          } catch (err) {
            console.error(`Failed to fetch appointment ${prescription.appointment_id}`, err);
            return {
              ...prescription,
              patient_name: `Patient ID: ${prescription.appointment_id}`,
              doctor_name: `Doctor ID: ${prescription.appointment_id}`,
            };
          }
        })
      );

      setPrescriptions(prescriptionsWithNames);
      setMeta(data.meta);
    } catch (err) {
      console.error("Failed to fetch prescriptions", err);
    }
  };

  const medicineCache: Record<string, string> = {};

  const fetchMedicineName = async (id: number): Promise<string> => {
    const medicineId = id.toString();
    if (medicineCache[medicineId]) return medicineCache[medicineId];
    try {
      const res = await fetch(`http://127.0.0.1:8011/medicines/${id}`);
      const data = await res.json();
      const name = data.medicine_name;
      medicineCache[medicineId] = name;
      return name;
    } catch (err) {
      console.error("Failed to fetch medicine", err);
      return `Medicine ID: ${id}`;
    }
  };

  // Fetch danh sách thuốc
  const fetchMedicines = async () => {
    if (medicinesLoaded) return;
    try {
      const res = await fetch(`http://127.0.0.1:8011/medicines?page=1&page_size=100`);
      const data = await res.json();
      setMedicines(data.data || []);
      setMedicinesLoaded(true);
    } catch (err) {
      console.error("Failed to fetch medicines", err);
    }
  };

  // Xử lý khi chọn thuốc từ dropdown
  const handleMedicineSelect = (itemId: string, selectedMedicine: Medicine) => {
    if (!editedPrescription) return;
    
    const updatedItems = editedPrescription.items?.map(item => {
      if (item.item_id === itemId) {
        return {
          ...item,
          medication_id: selectedMedicine.medication_id,
          medication_name: selectedMedicine.medicine_name,
          unit_prescribed: selectedMedicine.unit, // Auto-fill unit
          dose: selectedMedicine.strength, // Auto-fill dose from strength
        };
      }
      return item;
    });

    setEditedPrescription({
      ...editedPrescription,
      items: updatedItems
    });
  };

  const fetchPrescriptionDetail = async (id: number) => {
    setLoadingDetail(true);
    try {
      const res = await fetch(`http://127.0.0.1:8011/prescriptions/${id}`);
      const data: Prescription = await res.json();

      if (data.items) {
        for (const item of data.items) {
          if (typeof item.medication_id === 'number') {
            item.medication_name = await fetchMedicineName(item.medication_id);
          }
        }
      }

      // Fetch appointment details to get patient and doctor names
      try {
        const appointmentRes = await fetch(`http://127.0.0.1:8005/appointments/${data.appointment_id}`);
        const appointmentData: AppointmentDetail = await appointmentRes.json();
        data.patient_name = appointmentData.patient_name;
        data.doctor_name = appointmentData.doctor_name;
      } catch (err) {
        console.error(`Failed to fetch appointment ${data.appointment_id}`, err);
      }

      setSelected(data);
    } catch (err) {
      console.error("Failed to fetch prescription detail", err);
    } finally {
      setLoadingDetail(false);
    }
  };

  const fetchPrescriptionForDispense = async (id: number) => {
    setLoadingDispense(true);
    try {
      const res = await fetch(`http://127.0.0.1:8011/prescriptions/${id}`);
      const data: Prescription = await res.json();

      if (data.items) {
        for (const item of data.items) {
          item.medication_name = await fetchMedicineName(item.medication_id);
        }
      }

      // Fetch appointment details to get patient and doctor names
      try {
        const appointmentRes = await fetch(`http://127.0.0.1:8005/appointments/${data.appointment_id}`);
        const appointmentData: AppointmentDetail = await appointmentRes.json();
        data.patient_name = appointmentData.patient_name;
        data.doctor_name = appointmentData.doctor_name;
      } catch (err) {
        console.error(`Failed to fetch appointment ${data.appointment_id}`, err);
      }

      setDispensePrescription(data);

      const items: DispenseItem[] = (data.items || []).map(item => ({
        prescription_item_id: item.item_id,
        quantity_dispensed: parseInt(item.quantity_prescribed) || 0,
        lot_number: "",
        expiry_date: new Date().toISOString().split("T")[0],
        notes: "",
        selected: true,
        prescription_item: item
      }));
      setDispenseItems(items);
    } catch (err) {
      console.error("Failed to fetch prescription for dispense", err);
    } finally {
      setLoadingDispense(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  // Handlers cho modal chi tiết
  const openDetailModal = (pres: Prescription) => {
    setDetailModalOpen(true);
    fetchPrescriptionDetail(pres.prescription_id);
    setEditMode(false);
    setEditedPrescription(null);
    setDeletedItems([]);
  };

  const closeDetailModal = () => {
    if (editMode) {
      if (!confirm("Bạn có chắc chắn muốn hủy chỉnh sửa?")) return;
    }
    setDetailModalOpen(false);
    setSelected(null);
    setEditMode(false);
    setEditedPrescription(null);
    setDeletedItems([]);
  };

  // Handlers cho modal cấp phát
  const openDispenseModal = (pres: Prescription) => {
    setDispenseModalOpen(true);
    setDispenseNotes("");
    setDispensedBy("");
    fetchPrescriptionForDispense(pres.prescription_id);
  };

  const closeDispenseModal = () => {
    setDispenseModalOpen(false);
    setDispensePrescription(null);
    setDispenseItems([]);
    setDispenseNotes("");
    setDispensedBy("");
  };

  const handleEditClick = () => {
    if (!selected) return;
    setEditedPrescription({ ...selected });
    setDeletedItems([]);
    setEditMode(true);
    fetchMedicines(); // Load medicines when entering edit mode
  };

  const handleSave = async () => {
    if (!editedPrescription) return;

    try {
      // 1. Update đơn thuốc chung
      await fetch(`http://127.0.0.1:8011/prescriptions/${editedPrescription.prescription_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          valid_from: new Date(editedPrescription.valid_from).toISOString(),
          valid_to: new Date(editedPrescription.valid_to).toISOString(),
          notes: editedPrescription.notes || "",
        }),
      });

      // 2. Xoá items bị xoá
      for (const itemId of deletedItems) {
        await fetch(
          `http://127.0.0.1:8011/prescriptions/${editedPrescription.prescription_id}/items/${itemId}`,
          { method: "DELETE" }
        );
      }

      // 3. Xử lý items: POST mới, PATCH cũ
      for (const item of editedPrescription.items || []) {
        if (deletedItems.includes(item.item_id.toString())) continue;

        // Nếu item mới tạm thời (id bắt đầu bằng 'temp-') → POST
        if (item.item_id.toString().startsWith("temp-")) {
          await fetch(
            `http://127.0.0.1:8011/prescriptions/${editedPrescription.prescription_id}/items`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                medication_id: item.medication_id,
                quantity_prescribed: Number(item.quantity_prescribed),
                unit_prescribed: item.unit_prescribed,
                dose: item.dose,
                frequency: item.frequency,
                duration: item.duration,
                notes: item.notes,
              }),
            }
          );
        } else {
          // Item cũ → PATCH
          await fetch(
            `http://127.0.0.1:8011/prescriptions/${editedPrescription.prescription_id}/items/${item.item_id}`,
            {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                medication_id: item.medication_id,
                quantity_prescribed: Number(item.quantity_prescribed),
                unit_prescribed: item.unit_prescribed,
                dose: item.dose,
                frequency: item.frequency,
                duration: item.duration,
                notes: item.notes,
              }),
            }
          );
        }
      }

      alert("✅ Chỉnh sửa thành công");
      fetchPrescriptions();
      fetchPrescriptionDetail(editedPrescription.prescription_id);
      setEditMode(false);
      setEditedPrescription(null);
      setDeletedItems([]);
    } catch (err) {
      console.error(err);
      alert("❌ Lỗi khi lưu chỉnh sửa");
    }
  };

  const handleCancelPrescription = async () => {
    if (!selected) return;
    if (!confirm("Bạn có chắc chắn muốn xoá đơn này?")) return;

    try {
      const res = await fetch(
        `http://127.0.0.1:8011/prescriptions/${selected.prescription_id}/cancel`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reason: "Bệnh nhân ngừng điều trị",
            canceled_by: 1, // Changed to number
          }),
        }
      );

      if (!res.ok) throw new Error("Xoá thất bại");

      alert("✅ Xoá thành công");
      closeDetailModal();
      fetchPrescriptions();
    } catch (err) {
      console.error(err);
      alert("❌ Có lỗi khi xoá đơn");
    }
  };

  const handleDispense = async () => {
    if (!dispensePrescription || !dispensedBy) {
      alert("❌ Vui lòng điền đầy đủ thông tin");
      return;
    }
  
    const selectedItems = dispenseItems.filter(item => item.selected);
    if (selectedItems.length === 0) {
      alert("❌ Vui lòng chọn ít nhất một thuốc để cấp phát");
      return;
    }
  
    try {
      // 1. Tạo dispense
      const dispenseRes = await fetch("http://127.0.0.1:8011/dispenses/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prescription_id: dispensePrescription.prescription_id,
          notes: dispenseNotes,
          created_by: parseInt(dispensedBy) || 1 // Convert to number
        }),
      });
  
      if (!dispenseRes.ok) throw new Error("Tạo phiếu cấp phát thất bại");
  
      const dispenseData = await dispenseRes.json();
      const dispenseId = dispenseData.dispense_id;
  
      // 2. Thêm các line items
      for (const item of selectedItems) {
        await fetch(`http://127.0.0.1:8011/dispenses/${dispenseId}/lines`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prescription_item_id: typeof item.prescription_item_id === 'string' ?
              parseInt(item.prescription_item_id) : item.prescription_item_id,
            quantity_dispensed: item.quantity_dispensed,
            lot_number: item.lot_number,
            expiry_date: new Date(item.expiry_date).toISOString(),
            notes: item.notes
          }),
        });
      }
  
      // 3. Complete dispense
      await fetch(`http://127.0.0.1:8011/dispenses/${dispenseId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dispensed_by: parseInt(dispensedBy) || 1 // Convert to number
        }),
      });
  
      // 4. Gửi email thông báo cho bệnh nhân (tạm hardcode email)
      await fetch("http://127.0.0.1:8022/notifications/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: "chikhangbui@gmail.com", // sau này thay bằng email bệnh nhân
          subject: "Đơn thuốc đã được cấp phát",
          text: `Đơn thuốc mã ${dispensePrescription.prescription_code} đã được cấp phát thành công.`,
        }),
      });
  
      alert("✅ Cấp phát thành công");
      closeDispenseModal();
      fetchPrescriptions();
    } catch (err) {
      console.error(err);
      alert("❌ Lỗi khi cấp phát thuốc");
    }
  };

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString("vi-VN");

  return (
    <Layout>
      <main className="container mx-auto my-8 flex-1 px-2">
        <h2 className="text-center text-primary text-2xl font-bold mb-6">
          Theo dõi đơn thuốc
        </h2>

        {/* Bảng danh sách đơn thuốc */}
        <div className="overflow-x-auto mb-8">
          <table className="min-w-full bg-white rounded-t-lg shadow border-separate border-spacing-0">
            <thead>
              <tr className="bg-primary text-white">
                <th className="py-3 px-4 border-b-2 border-primary first:rounded-tl-lg">STT</th>
                <th className="py-3 px-4 border-b-2 border-primary">Mã đơn</th>
                <th className="py-3 px-4 border-b-2 border-primary">Bác sĩ</th>
                <th className="py-3 px-4 border-b-2 border-primary">Bệnh nhân</th>
                <th className="py-3 px-4 border-b-2 border-primary">Ngày bắt đầu</th>
                <th className="py-3 px-4 border-b-2 border-primary">Ngày kết thúc</th>
                <th className="py-3 px-4 border-b-2 border-primary">Tình trạng</th>
                <th className="py-3 px-4 border-b-2 border-primary last:rounded-tr-lg">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {prescriptions.map((p, idx) => (
                <tr key={p.prescription_id} className="text-center hover:bg-primaryHover/10 transition">
                  <td className="py-2 px-4 border-b border-primary">{idx + 1}</td>
                  <td className="py-2 px-4 border-b border-primary font-medium">{p.prescription_code}</td>
                  <td className="py-2 px-4 border-b border-primary">{p.doctor_name || 'Đang tải...'}</td>
                  <td className="py-2 px-4 border-b border-primary">{p.patient_name || 'Đang tải...'}</td>
                  <td className="py-2 px-4 border-b border-primary">{formatDate(p.valid_from)}</td>
                  <td className="py-2 px-4 border-b border-primary">{formatDate(p.valid_to)}</td>
                  <td className="py-2 px-4 border-b border-primary">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${p.status === "CREATED" || p.status === "UPDATED"
                        ? "bg-gray-400 text-white"
                        : p.status === "DISPENSED"
                          ? "bg-green-500 text-white"
                          : p.status === "PARTIAL_DISPENSE"
                            ? "bg-yellow-500 text-black"
                            : p.status === "CANCELED"
                              ? "bg-red-500 text-white"
                              : "bg-gray-200 text-black" // fallback
                        }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b border-primary gap-2 flex justify-center">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium transition"
                      onClick={() => openDispenseModal(p)}
                      disabled={p.status === "CANCELED" || p.status === "DISPENSED"}
                    >
                      Cấp phát
                    </button>
                    <button
                      className="bg-primary hover:bg-primary-hover text-white px-3 py-1 rounded text-sm font-medium transition"
                      onClick={() => openDetailModal(p)}
                    >
                      Xem chi tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {meta && meta.total_pages > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            <button
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              disabled={!meta.has_prev}
              onClick={() => fetchPrescriptions(meta.page - 1)}
            >
              Trước
            </button>
            <span className="px-3 py-1">
              Trang {meta.page} / {meta.total_pages}
            </span>
            <button
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              disabled={!meta.has_next}
              onClick={() => fetchPrescriptions(meta.page + 1)}
            >
              Sau
            </button>
          </div>
        )}

        {/* Modal Chi tiết đơn thuốc */}
        {detailModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl relative">
              {/* Header */}
              <div className="flex justify-between items-center border-b px-6 py-4">
                <h5 className="text-lg font-bold">Chi tiết đơn thuốc</h5>
                <button
                  className="text-gray-500 hover:text-red-500 text-xl font-bold"
                  onClick={closeDetailModal}
                  aria-label="Đóng"
                >
                  ×
                </button>
              </div>

              {/* Nội dung */}
              <div className="p-6">
                {loadingDetail ? (
                  <p>Đang tải chi tiết...</p>
                ) : selected ? (
                  <>
                    <p><strong>Mã đơn:</strong> {selected.prescription_code}</p>
                    <p><strong>Bác sĩ:</strong> {selected.doctor_name || `ID: ${selected.appointment_id}`}</p>
                    <p><strong>Bệnh nhân:</strong> {selected.patient_name || `ID: ${selected.appointment_id}`}</p>

                    {/* Ngày bắt đầu/kết thúc */}
                    <div className="flex gap-2 my-2">
                      <div>
                        <label className="block text-sm font-medium">Ngày bắt đầu</label>
                        <input
                          type="date"
                          className="border p-1 rounded"
                          value={editMode ? editedPrescription?.valid_from.split("T")[0] : selected.valid_from.split("T")[0]}
                          onChange={(e) => editedPrescription && setEditedPrescription({ ...editedPrescription, valid_from: e.target.value })}
                          disabled={!editMode}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Ngày kết thúc</label>
                        <input
                          type="date"
                          className="border p-1 rounded"
                          value={editMode ? editedPrescription?.valid_to.split("T")[0] : selected.valid_to.split("T")[0]}
                          onChange={(e) => editedPrescription && setEditedPrescription({ ...editedPrescription, valid_to: e.target.value })}
                          disabled={!editMode}
                        />
                      </div>
                    </div>

                    {/* Ghi chú */}
                    <div className="my-2">
                      <label className="block text-sm font-medium">Ghi chú</label>
                      <textarea
                        className="border p-2 w-full rounded"
                        value={editMode ? editedPrescription?.notes || "" : selected.notes || ""}
                        onChange={(e) => editedPrescription && setEditedPrescription({ ...editedPrescription, notes: e.target.value })}
                        disabled={!editMode}
                      />
                    </div>

                    {/* Danh sách thuốc */}
                    <hr className="my-3" />
                    <h6 className="font-semibold mb-2">Danh sách thuốc:</h6>
                    {(editedPrescription?.items && editedPrescription.items.length >= 0) || !editMode ? (
                      <ul className="list-inside space-y-2">
                        {(editMode ? editedPrescription?.items?.filter(item => !deletedItems.includes(item.item_id)) : selected.items)?.map((item, idx) => (
                          <li key={item.item_id} className="border border-gray-200 p-3 rounded flex justify-between items-start gap-2">
                            <div className="flex flex-col gap-2 flex-1">
                              {/* Tên thuốc */}
                              <div className="flex gap-2 items-center">
                                <span className="w-24 font-semibold">Tên thuốc:</span>
                                {editMode ? (
                                  <select
                                    className="border p-2 rounded flex-1"
                                    value={item.medication_id || ""}
                                    onChange={(e) => {
                                      const medicineId = parseInt(e.target.value);
                                      const selectedMedicine = medicines.find(m => m.medication_id === medicineId);
                                      if (selectedMedicine && editedPrescription) {
                                        handleMedicineSelect(item.item_id, selectedMedicine);
                                      }
                                    }}
                                  >
                                    <option value="">-- Chọn thuốc --</option>
                                    {medicines.map(medicine => (
                                      <option key={medicine.medication_id} value={medicine.medication_id}>
                                        {medicine.medicine_name} ({medicine.strength} {medicine.unit})
                                      </option>
                                    ))}
                                  </select>
                                ) : (
                                  <span className="p-1 rounded flex-1">{item.medication_name || ""}</span>
                                )}
                              </div>

                              {/* Số lượng, Đơn vị, Liều */}
                              <div className="flex gap-2">
                                <div className="flex items-center gap-1 flex-1">
                                  <span className="font-semibold whitespace-nowrap">Số lượng:</span>
                                  {editMode ? (
                                    <input
                                      type="number"
                                      className="border p-1 rounded w-full"
                                      value={item.quantity_prescribed}
                                      onChange={(e) => {
                                        if (!editedPrescription) return;
                                        const updatedItems = editedPrescription.items?.map(i => 
                                          i.item_id === item.item_id 
                                            ? { ...i, quantity_prescribed: e.target.value }
                                            : i
                                        );
                                        setEditedPrescription({
                                          ...editedPrescription,
                                          items: updatedItems
                                        });
                                      }}
                                    />
                                  ) : (
                                    <span className="p-1 rounded w-full">{item.quantity_prescribed}</span>
                                  )}
                                </div>

                                <div className="flex items-center gap-1 flex-1">
                                  <span className="font-semibold whitespace-nowrap">Đơn vị:</span>
                                  {editMode ? (
                                    <input
                                      type="text"
                                      className="border p-1 rounded w-full"
                                      value={item.unit_prescribed}
                                      onChange={(e) => {
                                        if (!editedPrescription) return;
                                        const updatedItems = editedPrescription.items?.map(i => 
                                          i.item_id === item.item_id 
                                            ? { ...i, unit_prescribed: e.target.value }
                                            : i
                                        );
                                        setEditedPrescription({
                                          ...editedPrescription,
                                          items: updatedItems
                                        });
                                      }}
                                    />
                                  ) : (
                                    <span className="p-1 rounded w-full">{item.unit_prescribed}</span>
                                  )}
                                </div>

                                <div className="flex items-center gap-1 flex-1">
                                  <span className="font-semibold whitespace-nowrap">Liều:</span>
                                  {editMode ? (
                                    <input
                                      type="text"
                                      className="border p-1 rounded w-full"
                                      value={item.dose}
                                      onChange={(e) => {
                                        if (!editedPrescription) return;
                                        const updatedItems = editedPrescription.items?.map(i => 
                                          i.item_id === item.item_id 
                                            ? { ...i, dose: e.target.value }
                                            : i
                                        );
                                        setEditedPrescription({
                                          ...editedPrescription,
                                          items: updatedItems
                                        });
                                      }}
                                    />
                                  ) : (
                                    <span className="p-1 rounded w-full">{item.dose}</span>
                                  )}
                                </div>
                              </div>

                              {/* Tần suất, Thời gian, Ghi chú */}
                              <div className="flex gap-2">
                                <div className="flex items-center gap-1 flex-1">
                                  <span className="font-semibold whitespace-nowrap">Tần suất:</span>
                                  {editMode ? (
                                    <input
                                      type="text"
                                      className="border p-1 rounded w-full"
                                      value={item.frequency}
                                      onChange={(e) => {
                                        if (!editedPrescription) return;
                                        const updatedItems = editedPrescription.items?.map(i => 
                                          i.item_id === item.item_id 
                                            ? { ...i, frequency: e.target.value }
                                            : i
                                        );
                                        setEditedPrescription({
                                          ...editedPrescription,
                                          items: updatedItems
                                        });
                                      }}
                                    />
                                  ) : (
                                    <span className="p-1 rounded w-full">{item.frequency}</span>
                                  )}
                                </div>

                                <div className="flex items-center gap-1 flex-1">
                                  <span className="font-semibold whitespace-nowrap">Thời gian:</span>
                                  {editMode ? (
                                    <input
                                      type="text"
                                      className="border p-1 rounded w-full"
                                      value={item.duration}
                                      onChange={(e) => {
                                        if (!editedPrescription) return;
                                        const updatedItems = editedPrescription.items?.map(i => 
                                          i.item_id === item.item_id 
                                            ? { ...i, duration: e.target.value }
                                            : i
                                        );
                                        setEditedPrescription({
                                          ...editedPrescription,
                                          items: updatedItems
                                        });
                                      }}
                                    />
                                  ) : (
                                    <span className="p-1 rounded w-full">{item.duration}</span>
                                  )}
                                </div>

                                <div className="flex items-center gap-1 flex-1">
                                  <span className="font-semibold whitespace-nowrap">Ghi chú:</span>
                                  {editMode ? (
                                    <input
                                      type="text"
                                      className="border p-1 rounded w-full"
                                      value={item.notes}
                                      onChange={(e) => {
                                        if (!editedPrescription) return;
                                        const updatedItems = editedPrescription.items?.map(i => 
                                          i.item_id === item.item_id 
                                            ? { ...i, notes: e.target.value }
                                            : i
                                        );
                                        setEditedPrescription({
                                          ...editedPrescription,
                                          items: updatedItems
                                        });
                                      }}
                                    />
                                  ) : (
                                    <span className="p-1 rounded w-full">{item.notes}</span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Xoá item */}
                            {editMode && (
                              <button
                                className="text-red-500 hover:bg-red-50 font-bold text-xl self-start w-8 h-8 rounded-full flex items-center justify-center"
                                onClick={() => {
                                  if (!editedPrescription) return;
                                  const itemId = item.item_id;

                                  // 1. Thêm vào deletedItems
                                  setDeletedItems([...deletedItems, itemId]);

                                  // 2. Loại bỏ khỏi items hiện tại
                                  setEditedPrescription({
                                    ...editedPrescription,
                                    items: editedPrescription.items?.filter(i => i.item_id !== itemId)
                                  });
                                }}
                                title="Xóa thuốc"
                              >
                                ×
                              </button>
                            )}
                          </li>
                        ))}

                        {/* Nút thêm mới */}
                        {editMode && (
                          <li>
                            <button
                              className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded text-sm font-medium flex items-center gap-2"
                              onClick={() => {
                                if (!editedPrescription) return;
                                const newItem: PrescriptionItem = {
                                  item_id: `temp-${Date.now()}`, // id tạm
                                  medication_id: 0,
                                  medication_name: "",
                                  quantity_prescribed: "",
                                  unit_prescribed: "",
                                  dose: "",
                                  frequency: "",
                                  duration: "",
                                  notes: "",
                                  created_at: new Date().toISOString(),
                                  updated_at: new Date().toISOString(),
                                };
                                setEditedPrescription({
                                  ...editedPrescription,
                                  items: [...(editedPrescription.items || []), newItem],
                                });
                              }}
                            >
                              + Thêm thuốc
                            </button>
                          </li>
                        )}
                      </ul>
                    ) : (
                      <p>Chưa có thuốc.</p>
                    )}
                  </>
                ) : (
                  <p>Lỗi khi tải dữ liệu</p>
                )}
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-2 border-t px-6 py-4">
                {!editMode ? (
                  <>
                    <button
                      className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-6 py-2 rounded transition"
                      onClick={handleEditClick}
                    >
                      Chỉnh sửa
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded transition"
                      onClick={handleCancelPrescription}
                    >
                      Huỷ đơn
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded transition"
                      onClick={handleSave}
                    >
                      Xác nhận
                    </button>
                    <button
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-6 py-2 rounded transition"
                      onClick={() => {
                        setEditMode(false);
                        setEditedPrescription(null);
                        setDeletedItems([]);
                      }}
                    >
                      Hủy
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modal Cấp phát thuốc */}
        {dispenseModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl relative max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex justify-between items-center border-b px-6 py-4 sticky top-0 bg-white">
                <h5 className="text-lg font-bold">Cấp phát thuốc</h5>
                <button
                  className="text-gray-500 hover:text-red-500 text-xl font-bold"
                  onClick={closeDispenseModal}
                  aria-label="Đóng"
                >
                  ×
                </button>
              </div>

              {/* Nội dung */}
              <div className="p-6">
                {loadingDispense ? (
                  <p>Đang tải thông tin...</p>
                ) : dispensePrescription ? (
                  <>
                    <div className="mb-4">
                      <p><strong>Mã đơn:</strong> {dispensePrescription.prescription_code}</p>
                      <p><strong>Bác sĩ:</strong> {dispensePrescription.doctor_name || `ID: ${dispensePrescription.appointment_id}`}</p>
                      <p><strong>Bệnh nhân:</strong> {dispensePrescription.patient_name || `ID: ${dispensePrescription.appointment_id}`}</p>
                    </div>

                    {/* Thông tin cấp phát */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Người cấp phát *</label>
                        <input
                          type="text"
                          className="border p-2 rounded w-full"
                          value={dispensedBy}
                          onChange={(e) => setDispensedBy(e.target.value)}
                          placeholder="Nhập ID người cấp phát"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Ghi chú</label>
                        <input
                          type="text"
                          className="border p-2 rounded w-full"
                          value={dispenseNotes}
                          onChange={(e) => setDispenseNotes(e.target.value)}
                          placeholder="Ghi chú (tùy chọn)"
                        />
                      </div>
                    </div>

                    {/* Danh sách thuốc để cấp phát */}
                    <hr className="my-4" />
                    <h6 className="font-semibold mb-3">Danh sách thuốc cấp phát:</h6>

                    {dispenseItems.length > 0 ? (
                      <div className="space-y-3">
                        {dispenseItems.map((item, idx) => (
                          <div key={item.prescription_item_id} className="border border-gray-200 p-3 rounded">
                            {/* Checkbox để chọn/bỏ chọn item */}
                            <div className="flex items-center mb-2">
                              <input
                                type="checkbox"
                                className="mr-2"
                                checked={item.selected}
                                onChange={(e) => {
                                  const newItems = [...dispenseItems];
                                  newItems[idx].selected = e.target.checked;
                                  setDispenseItems(newItems);
                                }}
                              />
                              <span className="font-semibold text-lg">
                                {item.prescription_item.medication_name}
                              </span>
                            </div>

                            {/* Thông tin thuốc gốc (chỉ đọc) */}
                            <div className="bg-gray-50 p-2 rounded mb-2 grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                              <div>
                                <span className="font-medium">Liều kê:</span> {item.prescription_item.dose}
                              </div>
                              <div>
                                <span className="font-medium">Tần suất:</span> {item.prescription_item.frequency}
                              </div>
                              <div>
                                <span className="font-medium">Thời gian:</span> {item.prescription_item.duration}
                              </div>
                              <div>
                                <span className="font-medium">SL kê:</span> {item.prescription_item.quantity_prescribed} {item.prescription_item.unit_prescribed}
                              </div>
                            </div>

                            {/* Thông tin cấp phát (có thể chỉnh sửa khi được chọn) */}
                            {item.selected && (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                                <div>
                                  <label className="block text-sm font-medium mb-1">Số lượng cấp phát *</label>
                                  <input
                                    type="number"
                                    className="border p-2 rounded w-full"
                                    value={item.quantity_dispensed}
                                    onChange={(e) => {
                                      const newItems = [...dispenseItems];
                                      newItems[idx].quantity_dispensed = parseInt(e.target.value) || 0;
                                      setDispenseItems(newItems);
                                    }}
                                    min="0"
                                    max={parseInt(item.prescription_item.quantity_prescribed)}
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium mb-1">Số lô *</label>
                                  <input
                                    type="text"
                                    className="border p-2 rounded w-full"
                                    value={item.lot_number}
                                    onChange={(e) => {
                                      const newItems = [...dispenseItems];
                                      newItems[idx].lot_number = e.target.value;
                                      setDispenseItems(newItems);
                                    }}
                                    placeholder="Nhập số lô"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium mb-1">Ngày hết hạn *</label>
                                  <input
                                    type="date"
                                    className="border p-2 rounded w-full"
                                    value={item.expiry_date}
                                    onChange={(e) => {
                                      const newItems = [...dispenseItems];
                                      newItems[idx].expiry_date = e.target.value;
                                      setDispenseItems(newItems);
                                    }}
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium mb-1">Ghi chú</label>
                                  <input
                                    type="text"
                                    className="border p-2 rounded w-full"
                                    value={item.notes}
                                    onChange={(e) => {
                                      const newItems = [...dispenseItems];
                                      newItems[idx].notes = e.target.value;
                                      setDispenseItems(newItems);
                                    }}
                                    placeholder="Ghi chú (tùy chọn)"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>Không có thuốc trong đơn này.</p>
                    )}
                  </>
                ) : (
                  <p>Lỗi khi tải dữ liệu</p>
                )}
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-2 border-t px-6 py-4 sticky bottom-0 bg-white">
                <button
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded transition"
                  onClick={handleDispense}
                  disabled={!dispensedBy || dispenseItems.filter(item => item.selected).length === 0}
                >
                  Xác nhận cấp phát
                </button>
                <button
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-6 py-2 rounded transition"
                  onClick={closeDispenseModal}
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </Layout>
  );
}