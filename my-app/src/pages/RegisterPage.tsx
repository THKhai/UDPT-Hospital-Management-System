import React, { useState } from "react";
import Layout from "../components/Layout";

export default function RegisterPage() {
  const [form, setForm] = useState({
    fullName: "",
    dob: "",
    gender: "",
    phone: "",
    cccd: "",
    insurance: "",
    note: "",
  });
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, gender: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate required fields
    if (
      !form.fullName ||
      !form.dob ||
      !form.gender ||
      !form.phone ||
      !form.cccd
    ) {
      setSuccess(false);
      return;
    }
    setSuccess(true);
    setForm({
      fullName: "",
      dob: "",
      gender: "",
      phone: "",
      cccd: "",
      insurance: "",
      note: "",
    });
  };

  return (
    <Layout>
      <div className="container my-8">
        <div className="max-w-xl mx-auto bg-white shadow rounded-2xl p-8">
          <h3 className="text-center text-primary text-2xl font-bold mb-6">
            Đăng ký khám bệnh
          </h3>
          {success && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded mb-4 text-center">
              Đăng ký thành công! Chúng tôi sẽ liên hệ với bạn sớm.
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="fullName" className="block font-medium mb-1 text-primary">
                Họ và tên
              </label>
              <input
                type="text"
                className="w-full border border-primary rounded px-3 py-2"
                id="fullName"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="dob" className="block font-medium mb-1 text-primary">
                Ngày sinh
              </label>
              <input
                type="date"
                className="w-full border border-primary rounded px-3 py-2"
                id="dob"
                name="dob"
                value={form.dob}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-1 text-primary">Giới tính</label>
              <div className="flex gap-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio"
                    name="gender"
                    value="Nam"
                    checked={form.gender === "Nam"}
                    onChange={handleGenderChange}
                    required
                  />
                  <span className="ml-2">Nam</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio"
                    name="gender"
                    value="Nữ"
                    checked={form.gender === "Nữ"}
                    onChange={handleGenderChange}
                  />
                  <span className="ml-2">Nữ</span>
                </label>
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="phone" className="block font-medium mb-1 text-primary">
                Số điện thoại
              </label>
              <input
                type="tel"
                className="w-full border border-primary rounded px-3 py-2"
                id="phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="cccd" className="block font-medium mb-1 text-primary">
                Số CCCD / CMND
              </label>
              <input
                type="text"
                className="w-full border border-primary rounded px-3 py-2"
                id="cccd"
                name="cccd"
                value={form.cccd}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="insurance" className="block font-medium mb-1 text-primary">
                Mã thẻ bảo hiểm (nếu có)
              </label>
              <input
                type="text"
                className="w-full border border-primary rounded px-3 py-2"
                id="insurance"
                name="insurance"
                value={form.insurance}
                onChange={handleChange}
                placeholder="Bỏ trống nếu không có"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="note" className="block font-medium mb-1 text-primary">
                Ghi chú thêm
              </label>
              <textarea
                className="w-full border border-primary rounded px-3 py-2"
                id="note"
                name="note"
                rows={3}
                value={form.note}
                onChange={handleChange}
              />
            </div>
            <button
              type="submit"
              className="bg-primary hover:bg-primaryHover text-white font-semibold px-6 py-2 rounded transition w-full"
            >
              Đăng ký khám
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}