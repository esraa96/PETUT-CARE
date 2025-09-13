import React, { Fragment } from "react";
import logo from "../../assets/petut.png";

import ReactStars from "react-rating-stars-component";

export default function ViewDoctorModal({ doctor, modalId }) {
  if (!doctor) return null;
  return (
    <Fragment>
      <div
        className="modal fade"
        id={`viewdoctor-${modalId}`}
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex={-1}
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header d-flex align-items-center justify-content-between">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">
                Doctor Details
              </h1>
              <img src={logo} width={"90px"} height={"90px"} alt="logo" />
            </div>
            <div className="modal-body d-flex align-items-start gap-5 ">
              <div className="left">
                <img
                  src={doctor?.profileImage}
                  alt="doctor-image"
                  style={{ width: "250px", height: "250px" }}
                />
              </div>
              <div className="right d-flex align-items-start gap-3">
                <div className="">
                  <p>Doctor Name :</p>
                  <p>Email :</p>
                  <p>Phone :</p>
                  <p>Status :</p>
                  <p>Gender :</p>
                  <p>Rate :</p>
                </div>
                <div className="">
                  <p>{doctor.fullName || ""}</p>
                  <p>{doctor.email || ""}</p>
                  <p>{doctor.phone || ""}</p>
                  <p
                    style={{
                      color: "white",
                      backgroundColor:
                        doctor.status === "active" ? "#28a745  " : "#6c757d   ",
                      fontSize: "14px",
                    }}
                    className="px-3 py-1  rounded rounded-5  text-center "
                  >
                    {doctor.status || ""}
                  </p>
                  <p
                    style={{
                      color: "white",
                      backgroundColor:
                        doctor.gender === "male" ? "#007BFF " : "#E91E63 ",
                      fontSize: "14px",
                    }}
                    className="px-3 py-1 rounded rounded-5 text-center"
                  >
                    {doctor.gender || ""}
                  </p>
                  <ReactStars
                    count={3}
                    value={5}
                    edit={false}
                    size={24}
                    activeColor="#ffd700"
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer d-flex justify-content-end gap-2">
              <button
                type="button"
                id="close-btn-edit"
                className="w-[100px] px-4 py-2 bg-slate-700 text-white rounded-md hover:bg-slate-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
