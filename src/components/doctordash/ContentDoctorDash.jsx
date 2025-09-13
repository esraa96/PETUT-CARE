import React, { Fragment } from "react";
import { Outlet } from "react-router-dom";

export default function ContentDoctorDash({ open, doctorData, setDoctorData }) {
  return (
    <main className="flex-1 lg:ml-64 min-h-screen bg-gray-50">
      <div className="p-6">
        <Outlet doctorData={doctorData} setDoctorData={setDoctorData} />
      </div>
    </main>
  );
}
