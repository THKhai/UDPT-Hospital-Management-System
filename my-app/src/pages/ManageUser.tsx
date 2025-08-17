import React, { useState } from "react";
import Layout from "../components/Layout";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

const initialUsers: User[] = [
  { id: 1, name: "Nguyễn Văn A", email: "admin@example.com", role: "Admin" },
  { id: 2, name: "Trần Thị B", email: "b@example.com", role: "Bác sĩ" },
];

const roleOptions = ["Admin", "Bác sĩ", "Lễ tân"];

export default function ManageUser() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [modal, setModal] = useState<"add" | "edit" | "delete" | null>(null);
  const [selected, setSelected] = useState<User | null>(null);
  const [form, setForm] = useState({ name: "", email: "", role: "" });

  // Mở modal và set dữ liệu
  const openAdd = () => {
    setForm({ name: "", email: "", role: "" });
    setModal("add");
  };
  const openEdit = (user: User) => {
    setSelected(user);
    setForm({ name: user.name, email: user.email, role: user.role });
    setModal("edit");
  };
  const openDelete = (user: User) => {
    setSelected(user);
    setModal("delete");
  };
  const closeModal = () => {
    setModal(null);
    setSelected(null);
  };

  // Xử lý form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.role) return;
    setUsers([
      ...users,
      { id: users.length ? Math.max(...users.map(u => u.id)) + 1 : 1, ...form },
    ]);
    closeModal();
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setUsers(users.map(u => (u.id === selected.id ? { ...u, ...form } : u)));
    closeModal();
  };

  const handleDelete = () => {
    if (!selected) return;
    setUsers(users.filter(u => u.id !== selected.id));
    closeModal();
  };

  return (
    <Layout>
      <main className="container mx-auto my-8 flex-1 px-2">
        <h2 className="text-center text-primary text-2xl font-bold mb-6">Quản lý người dùng</h2>
        {/* Nút thêm */}
        <div className="text-end mb-4">
          <button
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded transition"
            onClick={openAdd}
          >
            + Thêm người dùng
          </button>
        </div>
        {/* Bảng danh sách */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-t-lg shadow border-separate border-spacing-0">
            <thead>
              <tr className="bg-primary text-white">
                <th className="py-3 px-4 border-b-2 border-primary first:rounded-tl-lg last:rounded-tr-lg">ID</th>
                <th className="py-3 px-4 border-b-2 border-primary">Họ tên</th>
                <th className="py-3 px-4 border-b-2 border-primary">Email</th>
                <th className="py-3 px-4 border-b-2 border-primary">Vai trò</th>
                <th className="py-3 px-4 border-b-2 border-primary last:rounded-tr-lg">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="text-center hover:bg-primaryHover/10 transition">
                  <td className="py-2 px-4 border-b border-primary">{u.id}</td>
                  <td className="py-2 px-4 border-b border-primary">{u.name}</td>
                  <td className="py-2 px-4 border-b border-primary">{u.email}</td>
                  <td className="py-2 px-4 border-b border-primary">{u.role}</td>
                  <td className="py-2 px-4 border-b border-primary space-x-2">
                    <button
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded text-sm font-medium transition"
                      onClick={() => openEdit(u)}
                    >
                      Sửa
                    </button>
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium transition"
                      onClick={() => openDelete(u)}
                    >
                      Xoá
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal Thêm/Sửa */}
        {(modal === "add" || modal === "edit") && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
              <form onSubmit={modal === "add" ? handleAdd : handleEdit}>
                <div className="flex justify-between items-center border-b px-6 py-4">
                  <h5 className="text-lg font-bold">
                    {modal === "add" ? "Thêm người dùng" : "Sửa người dùng"}
                  </h5>
                  <button
                    className="text-gray-500 hover:text-red-500 text-xl font-bold"
                    onClick={closeModal}
                    type="button"
                    aria-label="Đóng"
                  >
                    ×
                  </button>
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <label className="block font-medium mb-1 text-primary">Họ tên</label>
                    <input
                      type="text"
                      name="name"
                      className="w-full border border-primary rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block font-medium mb-1 text-primary">Email</label>
                    <input
                      type="email"
                      name="email"
                      className="w-full border border-primary rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block font-medium mb-1 text-primary">Vai trò</label>
                    <select
                      name="role"
                      className="w-full border border-primary rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                      value={form.role}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Chọn vai trò</option>
                      {roleOptions.map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 border-t px-6 py-4">
                  <button
                    type="submit"
                    className="bg-primary hover:bg-primaryHover text-white font-semibold px-6 py-2 rounded transition"
                  >
                    {modal === "add" ? "Lưu" : "Lưu thay đổi"}
                  </button>
                  <button
                    type="button"
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-6 py-2 rounded transition"
                    onClick={closeModal}
                  >
                    Huỷ
                  </button>
                </div>
              </form>
            </div>
            <div className="fixed inset-0" onClick={closeModal} />
          </div>
        )}

        {/* Modal Xoá */}
        {modal === "delete" && selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
              <div className="flex justify-between items-center border-b px-6 py-4">
                <h5 className="text-lg font-bold">Xác nhận xoá</h5>
                <button
                  className="text-gray-500 hover:text-red-500 text-xl font-bold"
                  onClick={closeModal}
                  aria-label="Đóng"
                >
                  ×
                </button>
              </div>
              <div className="p-6">
                Bạn có chắc chắn muốn xoá người dùng <strong>{selected.name}</strong> không?
              </div>
              <div className="flex justify-end gap-2 border-t px-6 py-4">
                <button
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded transition"
                  onClick={handleDelete}
                >
                  Xoá
                </button>
                <button
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-6 py-2 rounded transition"
                  onClick={closeModal}
                >
                  Huỷ
                </button>
              </div>
            </div>
            <div className="fixed inset-0" onClick={closeModal} />
          </div>
        )}
      </main>
    </Layout>
  );
}