import React, { Fragment } from "react";
import { Outlet } from "react-router-dom";

export default function ContentDoctorDash({ open, doctorData, setDoctorData }) {
  /*
      Tailwind approach:
      - On medium+ screens we add left margin equal to sidebar width when open.
      - When closed we use a smaller margin (collapsed width). On small screens
        we keep full width and let the sidebar overlay.
    */
  const sidebarOpenClass = open ? "md:ml-[260px]" : "md:ml-[72px]";

  return (
    <Fragment>
      <main
        className={`fade-in w-full mt-[clamp(80px,12vh,120px)] min-h-[calc(100vh-clamp(80px,12vh,120px))] ${sidebarOpenClass}`}
      >
        <div className="container-fluid px-3 md:px-6 py-3">
          <Outlet doctorData={doctorData} setDoctorData={setDoctorData} />
        </div>
      </main>
    </Fragment>
  );
}
