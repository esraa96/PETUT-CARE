import React, { Fragment } from "react";
import logo from "../../assets/petut.png";

export default function ViewOrderModal({ order, modalId }) {
  return (
    <Fragment>
      <div
        className="modal fade "
        id={`vieworder-${modalId}`}
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex={-1}
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header d-flex align-items-center justify-content-between py-0 pe-0">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">
                Order Details
              </h1>
              <img src={logo} width={"90px"} height={"90px"} alt="logo" />
            </div>
            <div className="modal-body ">
              <div className="top-body d-flex align-items-start gap-40">
                <div className="delivery-info">
                  <div className="delivery-name mb-2">
                    <span className="fw-bold">Client Name : </span>{" "}
                    {order.deliveryInfo.fullName}
                  </div>
                  <div className="delivery-address mb-2">
                    <span className="fw-bold">Client Address : </span>{" "}
                    {order.deliveryInfo.address}
                  </div>
                  <div className="delivery-phone mb-2">
                    <span className="fw-bold">Client Phone : </span>{" "}
                    {order.deliveryInfo.phone}
                  </div>
                  <div className="delivery-phone">
                    <span className="fw-bold">Client Email : </span>{" "}
                    {order.deliveryInfo.email}
                  </div>
                </div>
                <div className="payment-info ">
                  <div className="payment-method mb-2">
                    <span className="fw-bold">Payment Method : </span>{" "}
                    <span>{order.paymentInfo.paymentMethod}</span>
                  </div>
                  <div className="payment-date mb-2">
                    <span className="fw-bold">Delivery Method : </span>{" "}
                    {order.deliveryInfo.deliveryMethod}
                  </div>
                </div>
                <div className="date-time">
                  <div className="date">
                    <span className="fw-bold">Date: </span>{" "}
                    {order.createdAt
                      ? new Date(
                          order.createdAt.seconds * 1000
                        ).toLocaleDateString("en-GB")
                      : ""}
                  </div>
                  <div className="time">
                    <span className="fw-bold">Time: </span>{" "}
                    {order.createdAt
                      ? new Date(
                          order.createdAt.seconds * 1000
                        ).toLocaleTimeString()
                      : ""}
                  </div>
                  <div className="payment-status mb-2">
                    <span className="fw-bold">Order Status : </span>{" "}
                    <span
                      className={`badge px-3 py-1 rounded-1 ${
                        order.paymentInfo.status === "pending"
                          ? "bg-warning  text-dark"
                          : order.paymentInfo.status === "processing"
                          ? "bg-info text-white"
                          : order.paymentInfo.status === "delivered"
                          ? "bg-success text-white"
                          : order.paymentInfo.status === "cancelled"
                          ? "bg-danger text-white"
                          : "bg-secondary text-white"
                      }`}
                    >
                      {order.paymentInfo.status}
                    </span>
                  </div>
                </div>
              </div>
              <div
                className="order-table my-5"
                style={{
                  maxHeight: "620px",
                  overflowY: "auto",
                  overflowX: "auto",
                }}
              >
                <table className="table ">
                  <thead className="table-light py-3 position-sticky top-0">
                    <tr className="">
                      <th className="px-4 py-3 align-middle">productName</th>
                      <th className="px-4 py-3 align-middle">Image</th>
                      <th className="px-4 py-3 align-middle">Category</th>
                      <th className="px-4 py-3 align-middle">Price</th>
                      <th className="px-4 py-3 align-middle">Quantity</th>
                      <th className="px-4 py-3 align-middle">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.cart.items?.map((item, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-3 align-middle">
                          {item.productName}
                        </td>
                        <td className="px-4 py-3 align-middle">
                          <img
                            src={item.imageURL}
                            style={{
                              width: "60px",
                              height: "60px",
                              objectFit: "cover",
                              borderRadius: "8px",
                            }}
                            alt="product-image"
                          />
                        </td>
                        <td className="px-4 py-3 align-middle">
                          <span
                            style={{
                              color: "white",
                              backgroundColor:
                                item.category === "cat"
                                  ? "#A66DD4   "
                                  : item.category === "dog"
                                  ? "#4DA6FF  "
                                  : item.category === "bird"
                                  ? "#4CAF50 "
                                  : item.category === "toys"
                                  ? "#FFA726"
                                  : "red",
                              fontSize: "14px",
                              padding: "4px 8px",
                              borderRadius: "6px",
                            }}
                          >
                            {item.category || "N/A"}
                          </span>
                        </td>
                        <td className="px-4 py-3 align-middle">{item.price}</td>
                        <td className="px-4 py-3 align-middle">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-3 align-middle">
                          {item.totalPrice.toLocaleString("en-EG", {
                            style: "currency",
                            currency: "EGP",
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="total">
                  <div className="total-quantity mb-2">
                    <span className="fw-bold">Total Quantity: </span>{" "}
                    {order.cart.totalQuantity}{" "}
                  </div>
                  <div className="total-amount">
                    <span className="fw-bold">Total Amount: </span>{" "}
                    {order.cart.totalAmount} EGP
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                id="close-btn"
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
