import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import AppointmentPage from "../pages/AppointmentPage";
import BookingPage from "../pages/BookingPage";
import CancelAppointment from "../pages/CancelAppointment";
import ConfirmAppointmentPage from "../pages/ConfirmAppointmentPage";
import CreatePrescription from "../pages/CreatePrescription";
import DispensePrescriptionPage from "../pages/DispensePrescriptionPage";
import FinancialReportPage from "../pages/FinancialReportPage";
import ManageUser from "../pages/ManageUser";
import MedicalHistoryPage from "../pages/MedicalHistoryPage";
import MedicalReportPage from "../pages/MedicalReportPage";
import PatientLookUpPage from "../pages/PatientLookUpPage";
import PrescriptionReportPage from "../pages/PrescriptionReportPage";
import PrescriptionPage from "../pages/PrescriptionPage";
import RegisterPage from "../pages/RegisterPage";
import UpdateAppointmentPage from "../pages/UpdateAppointmentPage";
import UpdatePatientPage from "../pages/UpdatePatientPage";
import MyAppointments from "../pages/MyAppointmentPage";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Other routes */}
        <Route path="/appointments" element={<AppointmentPage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/cancel-appointment" element={<CancelAppointment />} />
        <Route path="/confirm-appointment" element={<ConfirmAppointmentPage />} />
        <Route path="/create-prescription" element={<CreatePrescription />} />
        <Route path="/dispense-prescription" element={<DispensePrescriptionPage />} />
        <Route path="/financial-report" element={<FinancialReportPage />} />
        <Route path="/manage-user" element={<ManageUser />} />
        <Route path="/medical-history" element={<MedicalHistoryPage />} />
        <Route path="/medical-report" element={<MedicalReportPage />} />
        <Route path="/patient-lookup" element={<PatientLookUpPage />} />
        <Route path="/prescription-report" element={<PrescriptionReportPage />} />
        <Route path="/prescriptions" element={<PrescriptionPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/update-appointment" element={<UpdateAppointmentPage />} />
        <Route path="/update-patient" element={<UpdatePatientPage />} />
        <Route path="/my-appointments" element={<MyAppointments />} />
        
        {/* Add more routes as needed */}
        {/* Redirect to login if not authenticated */}

        {/* Add more routes as needed */}
        {/* Redirect to login if not authenticated */}
        {/* Redirect unknown routes to home or login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
