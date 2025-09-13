import React, { Fragment } from "react";
import logo from "../../assets/petut.png";

export default function ViewAdminModal({ admin, modalId, onClose }) {
  if (!admin) return null;

  return (
    <Fragment>
      {/* Backdrop */}
      <div
        id={`viewadmin-${modalId}`}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      >
        {/* Modal Box */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg w-full max-w-3xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
            <h1 className="text-lg font-semibold text-slate-800 dark:text-white">
              Admin Details
            </h1>
            <img src={logo} width="70" height="70" alt="logo" />
          </div>

          {/* Body */}
          <div className="flex flex-col md:flex-row items-start gap-6 p-6">
            {/* Left: Image */}
            <div className="flex-shrink-0 mx-auto md:mx-0">
              <img
                src={admin.profileImage}
                alt="user"
                className="w-48 h-48 rounded-lg object-cover shadow-md"
              />
            </div>

            {/* Right: Details */}
            <div className="flex flex-col gap-2 flex-1 text-slate-700 dark:text-slate-200">
              <div className="flex gap-3">
                <span className="font-medium w-20">Name:</span>
                <span>{admin.fullName || "-"}</span>
              </div>
              <div className="flex gap-3">
                <span className="font-medium w-20">Email:</span>
                <span>{admin.email || "-"}</span>
              </div>
              <div className="flex gap-3">
                <span className="font-medium w-20">Phone:</span>
                <span>{admin.phone || "-"}</span>
              </div>
              <div className="flex gap-3 items-center">
                <span className="font-medium w-20">Role:</span>
                <span
                  className={`px-3 py-1 rounded-full text-sm text-white ${
                    admin.role === "customer"
                      ? "bg-gray-600"
                      : "bg-blue-600"
                  }`}
                >
                  {admin.role || "-"}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 px-6 py-4 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={onClose}
              className="w-24 px-4 py-2 bg-slate-700 text-white rounded-md hover:bg-slate-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
