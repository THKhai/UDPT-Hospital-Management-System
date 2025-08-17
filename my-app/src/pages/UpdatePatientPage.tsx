import React, { useState } from "react";
import Layout from "../components/Layout";

function UpdatePatient() {
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [insurance, setInsurance] = useState("");
  const [relativeName, setRelativeName] = useState("");
  const [relativeRelation, setRelativeRelation] = useState("");
  const [relativePhone, setRelativePhone] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!address || !phone || !insurance) {
      setSuccessMsg("");
      return;
    }
    setSuccessMsg("✅ Thông tin bệnh nhân đã được cập nhật thành công!");
    setAddress("");
    setPhone("");
    setInsurance("");
    setRelativeName("");
    setRelativeRelation("");
    setRelativePhone("");
  };

  return (
    <Layout>
      <main className="container mx-auto my-8 flex-1 px-2">
        <h2 className="text-center text-2xl font-bold text-primary mb-6">
          Cập nhật thông tin bệnh nhân
        </h2>

        {successMsg && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded mb-6 text-center">
            {successMsg}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Địa chỉ */}
          <div>
            <label
              htmlFor="address"
              className="block font-medium mb-1 text-primary"
            >
              Địa chỉ
            </label>
            <input
              type="text"
              id="address"
              placeholder="Nhập địa chỉ mới"
              className="w-full border border-primary rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          {/* Số điện thoại */}
          <div>
            <label
              htmlFor="phone"
              className="block font-medium mb-1 text-primary"
            >
              Số điện thoại
            </label>
            <input
              type="text"
              id="phone"
              placeholder="Nhập số điện thoại mới"
              className="w-full border border-primary rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          {/* Bảo hiểm */}
          <div>
            <label
              htmlFor="insurance"
              className="block font-medium mb-1 text-primary"
            >
              Thông tin bảo hiểm
            </label>
            <input
              type="text"
              id="insurance"
              placeholder="Nhập mã bảo hiểm mới"
              className="w-full border border-primary rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              value={insurance}
              onChange={(e) => setInsurance(e.target.value)}
              required
            />
          </div>

          {/* Tên người thân */}
          <div>
            <label
              htmlFor="relativeName"
              className="block font-medium mb-1 text-primary"
            >
              Tên người thân
            </label>
            <input
              type="text"
              id="relativeName"
              placeholder="Nhập tên người thân"
              className="w-full border border-primary rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              value={relativeName}
              onChange={(e) => setRelativeName(e.target.value)}
            />
          </div>

          {/* Quan hệ */}
          <div>
            <label
              htmlFor="relativeRelation"
              className="block font-medium mb-1 text-primary"
            >
              Quan hệ
            </label>
            <input
              type="text"
              id="relativeRelation"
              placeholder="VD: Anh trai, Mẹ..."
              className="w-full border border-primary rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              value={relativeRelation}
              onChange={(e) => setRelativeRelation(e.target.value)}
            />
          </div>

          {/* SĐT người thân */}
          <div>
            <label
              htmlFor="relativePhone"
              className="block font-medium mb-1 text-primary"
            >
              SĐT người thân
            </label>
            <input
              type="text"
              id="relativePhone"
              placeholder="Nhập số điện thoại người thân"
              className="w-full border border-primary rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              value={relativePhone}
              onChange={(e) => setRelativePhone(e.target.value)}
            />
          </div>

          {/* Nút cập nhật */}
          <div className="col-span-1 md:col-span-2 text-right">
            <button
              type="submit"
              className="bg-primary hover:bg-primaryHover text-white font-semibold px-6 py-2 rounded transition"
            >
              Cập nhật
            </button>
          </div>
        </form>
      </main>
    </Layout>
  );
}

export default UpdatePatient;
