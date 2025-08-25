import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";

type PrescriptionItem = {
  item_id: string;
  medication_id: string;
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
  prescription_id: string;
  prescription_code: string;
  patient_id: string;
  doctor_id: string;
  status: string;
  valid_from: string;
  valid_to: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  items?: PrescriptionItem[];
};

type Meta = {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
};

export default function PrescriptionPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<Prescription | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [editedPrescription, setEditedPrescription] = useState<Prescription | null>(null);
  const [deletedItems, setDeletedItems] = useState<string[]>([]);

  const fetchPrescriptions = async (page = 1, page_size = 10) => {
    try {
      const res = await fetch(`http://127.0.0.1:8011/prescriptions/?page=${page}&page_size=${page_size}`);
      const data = await res.json();
      setPrescriptions(data.data);
      setMeta(data.meta);
    } catch (err) {
      console.error("Failed to fetch prescriptions", err);
    }
  };

  const fetchPrescriptionDetail = async (id: string) => {
    setLoadingDetail(true);
    try {
      const res = await fetch(`http://127.0.0.1:8011/prescriptions/${id}`);
      const data: Prescription = await res.json();
      setSelected(data);
    } catch (err) {
      console.error("Failed to fetch prescription detail", err);
    } finally {
      setLoadingDetail(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const openModal = (pres: Prescription) => {
    setModalOpen(true);
    fetchPrescriptionDetail(pres.prescription_id);
    setEditMode(false);
    setEditedPrescription(null);
    setDeletedItems([]);
  };

  const closeModal = () => {
    if (editMode) {
      if (!confirm("Bạn có chắc chắn muốn hủy chỉnh sửa?")) return;
    }
    setModalOpen(false);
    setSelected(null);
    setEditMode(false);
    setEditedPrescription(null);
    setDeletedItems([]);
  };

  const handleEditClick = () => {
    if (!selected) return;
    setEditedPrescription({ ...selected });
    setDeletedItems([]);
    setEditMode(true);
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
        if (deletedItems.includes(item.item_id)) continue;

        // Nếu item mới tạm thời (id bắt đầu bằng 'temp-') → POST
        if (item.item_id.startsWith("temp-")) {
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


  const handleDeletePrescription = async () => {
    if (!selected) return;
    if (!confirm("Bạn có chắc chắn muốn xoá đơn này?")) return;
    try {
      const res = await fetch(`http://127.0.0.1:8011/prescriptions/${selected.prescription_id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Xoá thất bại");
      alert("✅ Xoá thành công");
      closeModal();
      fetchPrescriptions();
    } catch (err) {
      console.error(err);
      alert("❌ Có lỗi khi xoá đơn");
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
                  <td className="py-2 px-4 border-b border-primary">TODO</td>
                  <td className="py-2 px-4 border-b border-primary">TODO</td>
                  <td className="py-2 px-4 border-b border-primary">{formatDate(p.valid_from)}</td>
                  <td className="py-2 px-4 border-b border-primary">{formatDate(p.valid_to)}</td>
                  <td className="py-2 px-4 border-b border-primary">
                    <span
                      className={
                        p.status === "Đang sử dụng"
                          ? "inline-block px-3 py-1 rounded-full bg-yellow-500 text-white text-xs font-semibold"
                          : "inline-block px-3 py-1 rounded-full bg-green-500 text-white text-xs font-semibold"
                      }
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b border-primary gap-2 flex justify-center">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium transition"
                      onClick={() => openModal(p)}
                    >
                      Cấp phát
                    </button>
                    <button
                      className="bg-primary hover:bg-primary-hover text-white px-3 py-1 rounded text-sm font-medium transition"
                      onClick={() => openModal(p)}
                    >
                      Xem chi tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl relative">
              {/* Header */}
              <div className="flex justify-between items-center border-b px-6 py-4">
                <h5 className="text-lg font-bold">Chi tiết đơn thuốc</h5>
                <button
                  className="text-gray-500 hover:text-red-500 text-xl font-bold"
                  onClick={closeModal}
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
                    <p><strong>Bác sĩ ID:</strong> {selected.doctor_id}</p>
                    <p><strong>Bệnh nhân ID:</strong> {selected.patient_id}</p>

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
                    {(editedPrescription?.items && editedPrescription.items.length > 0) || !editMode ? (
                      <ul className="list-inside space-y-2">
                        {(editMode ? editedPrescription?.items?.filter(item => !deletedItems.includes(item.item_id)) : selected.items)?.map((item, idx) => (
                          <li key={item.item_id} className="border border-gray-200 p-2 rounded flex justify-between items-start gap-2">
                            <div className="flex flex-col gap-1 flex-1">
                              <div className="flex gap-2 items-center">
                                <span className="w-24 font-semibold">Tên thuốc:</span>
                                <input
                                  type="text"
                                  className={`p-1 rounded w-full ${editMode ? "border" : "border-transparent"}`}
                                  value={item.medication_id}
                                  onChange={(e) => {
                                    if (!editedPrescription) return;
                                    const newItems = [...editedPrescription.items!];
                                    newItems[idx].medication_id = e.target.value;
                                    setEditedPrescription({ ...editedPrescription, items: newItems });
                                  }}
                                  disabled={!editMode}
                                />
                              </div>

                              <div className="flex gap-2">
                                <div className="flex gap-1 items-center w-1/3">
                                  <span className="font-semibold">Số lượng:</span>
                                  <input
                                    type="text"
                                    className={`p-1 rounded w-full ${editMode ? "border" : "border-transparent"}`}
                                    value={item.quantity_prescribed}
                                    onChange={(e) => {
                                      if (!editedPrescription) return;
                                      const newItems = [...editedPrescription.items!];
                                      newItems[idx].quantity_prescribed = e.target.value;
                                      setEditedPrescription({ ...editedPrescription, items: newItems });
                                    }}
                                    disabled={!editMode}
                                  />
                                </div>
                                <div className="flex gap-1 items-center w-1/3">
                                  <span className="font-semibold">Đơn vị:</span>
                                  <input
                                    type="text"
                                    className={`p-1 rounded w-full ${editMode ? "border" : "border-transparent"}`}
                                    value={item.unit_prescribed}
                                    onChange={(e) => {
                                      if (!editedPrescription) return;
                                      const newItems = [...editedPrescription.items!];
                                      newItems[idx].unit_prescribed = e.target.value;
                                      setEditedPrescription({ ...editedPrescription, items: newItems });
                                    }}
                                    disabled={!editMode}
                                  />
                                </div>
                                <div className="flex gap-1 items-center w-1/3">
                                  <span className="font-semibold">Liều:</span>
                                  <input
                                    type="text"
                                    className={`p-1 rounded w-full ${editMode ? "border" : "border-transparent"}`}
                                    value={item.dose}
                                    onChange={(e) => {
                                      if (!editedPrescription) return;
                                      const newItems = [...editedPrescription.items!];
                                      newItems[idx].dose = e.target.value;
                                      setEditedPrescription({ ...editedPrescription, items: newItems });
                                    }}
                                    disabled={!editMode}
                                  />
                                </div>
                              </div>

                              <div className="flex gap-2">
                                <div className="flex gap-1 items-center w-1/3">
                                  <span className="font-semibold">Tần suất:</span>
                                  <input
                                    type="text"
                                    className={`p-1 rounded w-full ${editMode ? "border" : "border-transparent"}`}
                                    value={item.frequency}
                                    onChange={(e) => {
                                      if (!editedPrescription) return;
                                      const newItems = [...editedPrescription.items!];
                                      newItems[idx].frequency = e.target.value;
                                      setEditedPrescription({ ...editedPrescription, items: newItems });
                                    }}
                                    disabled={!editMode}
                                  />
                                </div>
                                <div className="flex gap-1 items-center w-1/3">
                                  <span className="font-semibold">Thời gian:</span>
                                  <input
                                    type="text"
                                    className={`p-1 rounded w-full ${editMode ? "border" : "border-transparent"}`}
                                    value={item.duration}
                                    onChange={(e) => {
                                      if (!editedPrescription) return;
                                      const newItems = [...editedPrescription.items!];
                                      newItems[idx].duration = e.target.value;
                                      setEditedPrescription({ ...editedPrescription, items: newItems });
                                    }}
                                    disabled={!editMode}
                                  />
                                </div>
                                <div className="flex gap-1 items-center w-1/3">
                                  <span className="font-semibold">Ghi chú:</span>
                                  <input
                                    type="text"
                                    className={`p-1 rounded w-full ${editMode ? "border" : "border-transparent"}`}
                                    value={item.notes}
                                    onChange={(e) => {
                                      if (!editedPrescription) return;
                                      const newItems = [...editedPrescription.items!];
                                      newItems[idx].notes = e.target.value;
                                      setEditedPrescription({ ...editedPrescription, items: newItems });
                                    }}
                                    disabled={!editMode}
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Xoá item */}
                            {editMode && (
                              <button
                                className="text-red-500 font-bold text-xl self-start"
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
                              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm font-medium"
                              onClick={() => {
                                if (!editedPrescription) return;
                                const newItem: PrescriptionItem = {
                                  item_id: `temp-${Date.now()}`, // id tạm
                                  medication_id: "",
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
                      onClick={handleDeletePrescription}
                    >
                      Xoá
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

            {/* Click ngoài modal */}

          </div>
        )}
      </main>
    </Layout>
  );
}
