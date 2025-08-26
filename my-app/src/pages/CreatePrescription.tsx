import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";

function CreatePrescription() {
  const [patientId, setPatientId] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [encounterId, setEncounterId] = useState("");
  const [validFrom, setValidFrom] = useState("");
  const [validTo, setValidTo] = useState("");
  const [notes, setNotes] = useState("");
  const [medicines, setMedicines] = useState<any[]>([
    {
      medication_id: "",
      medicine_name: "",
      generic_name: "",
      form: "",
      strength: "",
      unit_prescribed: "",
      quantity_prescribed: "",
      dose: "",
      frequency: "",
      duration: "",
      notes: ""
    }
  ]);
  const [successMsg, setSuccessMsg] = useState("");
  const [medicineOptions, setMedicineOptions] = useState<any[]>([]);

  // fetch medicines from API
  useEffect(() => {
    fetch("http://127.0.0.1:8011/medicines?page=1&page_size=50")
      .then((res) => res.json())
      .then((data) => {
        setMedicineOptions(data.data || []);
      })
      .catch((err) => console.error(err));
  }, []);

  const formatDateTime = (dt: string) => (dt ? dt + ":00Z" : "");

  const handleMedicineChange = (idx: number, field: string, value: any) => {
    const newMeds = medicines.map((m, i) =>
      i === idx ? { ...m, [field]: value } : m
    );
    setMedicines(newMeds);
  };

  const handleSelectMedicine = (idx: number, medId: string) => {
    const selected = medicineOptions.find((m) => m.medication_id === medId);
    if (selected) {
      const newMeds = medicines.map((m, i) =>
        i === idx
          ? {
              ...m,
              medication_id: selected.medication_id,
              medicine_name: selected.medicine_name,
              generic_name: selected.generic_name,
              form: selected.form,
              strength: selected.strength,
              unit_prescribed: selected.unit
            }
          : m
      );
      setMedicines(newMeds);
    }
  };

  const handleAddMedicine = () => {
    setMedicines([
      ...medicines,
      {
        medication_id: "",
        medicine_name: "",
        generic_name: "",
        form: "",
        strength: "",
        unit_prescribed: "",
        quantity_prescribed: "",
        dose: "",
        frequency: "",
        duration: "",
        notes: ""
      }
    ]);
  };

  const handleRemoveMedicine = (idx: number) => {
    setMedicines(medicines.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      patient_id: patientId,
      doctor_id: doctorId,
      encounter_id: encounterId,
      valid_from: formatDateTime(validFrom),
      valid_to: formatDateTime(validTo),
      notes,
      items: medicines.map((m) => ({
        medication_id: m.medication_id,
        quantity_prescribed: Number(m.quantity_prescribed),
        unit_prescribed: m.unit_prescribed,
        dose: m.dose,
        frequency: m.frequency,
        duration: m.duration,
        notes: m.notes
      }))
    };

    try {
      const res = await fetch("http://127.0.0.1:8011/prescriptions/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Failed to save");

      setSuccessMsg("✅ Đơn thuốc đã lưu thành công!");
      setPatientId("");
      setDoctorId("");
      setEncounterId("");
      setValidFrom("");
      setValidTo("");
      setNotes("");
      setMedicines([
        {
          medication_id: "",
          medicine_name: "",
          generic_name: "",
          form: "",
          strength: "",
          unit_prescribed: "",
          quantity_prescribed: "",
          dose: "",
          frequency: "",
          duration: "",
          notes: ""
        }
      ]);
    } catch (err) {
      console.error(err);
      setSuccessMsg("❌ Lưu thất bại");
    }
  };

  return (
    <Layout>
      <main className="container mx-auto my-8 flex-1 px-2">
        <h2 className="text-2xl font-bold mb-6 text-center text-primary">
          Tạo đơn thuốc mới
        </h2>

        {successMsg && (
          <div className="mb-4 p-3 text-center bg-green-100 text-green-700 rounded">
            {successMsg}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow"
        >
          {/* Patient */}
          <div className="mb-4">
            <label className="block font-medium mb-1">Patient ID</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:border-primary"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              required
            />
          </div>

          {/* Doctor */}
          <div className="mb-4">
            <label className="block font-medium mb-1">Doctor ID</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:border-primary"
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              required
            />
          </div>

          {/* Dates */}
          <div className="mb-4 flex gap-2">
            <div className="flex-1">
              <label className="block font-medium mb-1">Valid From</label>
              <input
                type="datetime-local"
                className="w-full border rounded px-3 py-2 focus:outline-none focus:border-primary"
                value={validFrom}
                onChange={(e) => setValidFrom(e.target.value)}
                required
              />
            </div>
            <div className="flex-1">
              <label className="block font-medium mb-1">Valid To</label>
              <input
                type="datetime-local"
                className="w-full border rounded px-3 py-2 focus:outline-none focus:border-primary"
                value={validTo}
                onChange={(e) => setValidTo(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Medicines */}
          <div className="mb-4">
            <label className="block font-medium mb-1">Medicines</label>
            {medicines.map((m, idx) => (
              <div
                key={idx}
                className="border border-primary p-3 rounded mb-3"
              >
                {/* Select medicine */}
                <select
                  className="w-full border rounded px-2 py-1 mb-2 focus:outline-none focus:border-primary"
                  value={m.medication_id}
                  onChange={(e) =>
                    handleSelectMedicine(idx, e.target.value)
                  }
                  required
                >
                  <option value="">-- Select medicine --</option>
                  {medicineOptions.map((opt) => (
                    <option key={opt.medication_id} value={opt.medication_id}>
                      {opt.medicine_name} ({opt.strength})
                    </option>
                  ))}
                </select>

                {/* Auto filled but editable */}
                <input
                  type="text"
                  placeholder="Generic Name"
                  className="w-full border rounded px-2 py-1 mb-1 focus:outline-none focus:border-primary"
                  value={m.generic_name}
                  onChange={(e) =>
                    handleMedicineChange(idx, "generic_name", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="Form"
                  className="w-full border rounded px-2 py-1 mb-1 focus:outline-none focus:border-primary"
                  value={m.form}
                  onChange={(e) =>
                    handleMedicineChange(idx, "form", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="Strength"
                  className="w-full border rounded px-2 py-1 mb-1 focus:outline-none focus:border-primary"
                  value={m.strength}
                  onChange={(e) =>
                    handleMedicineChange(idx, "strength", e.target.value)
                  }
                />
                <input
                  type="number"
                  placeholder="Quantity"
                  className="w-full border rounded px-2 py-1 mb-1 focus:outline-none focus:border-primary"
                  value={m.quantity_prescribed}
                  onChange={(e) =>
                    handleMedicineChange(
                      idx,
                      "quantity_prescribed",
                      e.target.value
                    )
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="Unit (e.g. mg, pill)"
                  className="w-full border rounded px-2 py-1 mb-1 focus:outline-none focus:border-primary"
                  value={m.unit_prescribed}
                  onChange={(e) =>
                    handleMedicineChange(idx, "unit_prescribed", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="Dose"
                  className="w-full border rounded px-2 py-1 mb-1 focus:outline-none focus:border-primary"
                  value={m.dose}
                  onChange={(e) =>
                    handleMedicineChange(idx, "dose", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="Frequency"
                  className="w-full border rounded px-2 py-1 mb-1 focus:outline-none focus:border-primary"
                  value={m.frequency}
                  onChange={(e) =>
                    handleMedicineChange(idx, "frequency", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="Duration"
                  className="w-full border rounded px-2 py-1 mb-1 focus:outline-none focus:border-primary"
                  value={m.duration}
                  onChange={(e) =>
                    handleMedicineChange(idx, "duration", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="Notes"
                  className="w-full border rounded px-2 py-1 focus:outline-none focus:border-primary"
                  value={m.notes}
                  onChange={(e) =>
                    handleMedicineChange(idx, "notes", e.target.value)
                  }
                />

                {medicines.length > 1 && (
                  <button
                    type="button"
                    className="mt-2 bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() => handleRemoveMedicine(idx)}
                  >
                    X
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="bg-blue-500 text-white px-4 py-1 rounded"
              onClick={handleAddMedicine}
            >
              + Add medicine
            </button>
          </div>

          {/* Notes */}
          <div className="mb-4">
            <label className="block font-medium mb-1">Prescription Notes</label>
            <textarea
              className="w-full border rounded px-3 py-2 focus:outline-none focus:border-primary"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="text-end">
            <button
              type="submit"
              className="bg-primary text-white px-6 py-2 rounded"
            >
              Save
            </button>
          </div>
        </form>
      </main>
    </Layout>
  );
}

export default CreatePrescription;
