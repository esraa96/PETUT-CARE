import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../store/slices/cartSlice";
// Removed Firebase imports

// Import the new reusable components
import PaymentHeader from "../components/payment/PaymentHeader";
import PaymentMethodSelector from "../components/payment/PaymentMethodSelector";
import CardDetailsForm from "../components/payment/CardDetailsForm";
import PaymentOrderSummary from "../components/payment/PaymentOrderSummary";
import PaymentButton from "../components/payment/PaymentButton";
import { useAuth } from "../context/AuthContext";
import { placeOrderThunk } from "../store/slices/orderSlice";

const PaymentPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { currentUser } = useAuth();
  const cart = useSelector((state) => state.cart);
  const { totalAmount } = cart;
  const deliveryInfo = location.state?.deliveryInfo;

  const [paymentInfo, setPaymentInfo] = useState({
    paymentMethod: "card",
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
    saveCard: false,
    status: "pending",
  });

  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPaymentInfo((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, "");
    const formatted = digits.replace(/(.{4})/g, "$1 ").trim();
    return formatted.substring(0, 19);
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setPaymentInfo((prev) => ({ ...prev, cardNumber: formatted }));
    if (errors.cardNumber) {
      setErrors((prev) => ({ ...prev, cardNumber: "" }));
    }
  };

  const formatExpiryDate = (value) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length <= 2) {
      return digits;
    }
    return `${digits.substring(0, 2)}/${digits.substring(2, 4)}`;
  };

  const handleExpiryDateChange = (e) => {
    const formatted = formatExpiryDate(e.target.value);
    setPaymentInfo((prev) => ({ ...prev, expiryDate: formatted }));
    if (errors.expiryDate) {
      setErrors((prev) => ({ ...prev, expiryDate: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (paymentInfo.paymentMethod === "card") {
      if (
        !paymentInfo.cardNumber.trim() ||
        paymentInfo.cardNumber.replace(/\D/g, "").length !== 16
      ) {
        newErrors.cardNumber = "Please enter a valid 16-digit card number";
      }
      if (!paymentInfo.cardHolder.trim()) {
        newErrors.cardHolder = "Cardholder name is required";
      }
      if (
        !paymentInfo.expiryDate.trim() ||
        !/^\d{2}\/\d{2}$/.test(paymentInfo.expiryDate)
      ) {
        newErrors.expiryDate = "Please enter a valid expiry date (MM/YY)";
      } else {
        const [month, year] = paymentInfo.expiryDate.split("/");
        const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
        const currentDate = new Date();
        if (expiryDate < currentDate) {
          newErrors.expiryDate = "Card has expired";
        }
      }
      if (!paymentInfo.cvv.trim() || !/^\d{3,4}$/.test(paymentInfo.cvv)) {
        newErrors.cvv = "Please enter a valid CVV code";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!deliveryInfo) {
      setErrors((prev) => ({
        ...prev,
        general:
          "Delivery information missing. Please go back and fill it out.",
      }));
      return;
    }
    if (validateForm()) {
      setIsProcessing(true);

      // Generate a unique order ID
      const orderId = 'order_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

      // Prepare order data
      const orderData = {
        orderId: orderId,
        userId: currentUser?.uid,
        deliveryInfo,
        cart,
        paymentInfo: {
          paymentMethod: paymentInfo.paymentMethod,
          cardHolder: paymentInfo.cardHolder,
          status: paymentInfo.status,
          // Do NOT store card number, cvv, expiry in Firestore!
        },
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      try {
        await dispatch(
          placeOrderThunk({ uid: currentUser?.uid, orderData })
        ).unwrap();
        dispatch(clearCart());
        setIsProcessing(false);
        navigate("/order-confirmation");
      } catch (err) {
        console.error("Order placement error:", err);
        console.error("Order data:", orderData);
        setIsProcessing(false);
        setErrors((prev) => ({
          ...prev,
          general: err.message || "Order failed. Please try again.",
        }));
      }
    }
  };

  const paymentMethods = [
    { id: "card", name: "Credit / Debit Card" },
    { id: "cash", name: "Cash on Delivery" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 pb-24 mt-16">
      <PaymentHeader />

      <div className="py-6">
        <form onSubmit={handleSubmit}>
          <PaymentMethodSelector
            paymentMethods={paymentMethods}
            selectedMethod={paymentInfo.paymentMethod}
            handleChange={handleChange}
          />

          {paymentInfo.paymentMethod === "card" && (
            <CardDetailsForm
              paymentInfo={paymentInfo}
              errors={errors}
              handleChange={handleChange}
              handleCardNumberChange={handleCardNumberChange}
              handleExpiryDateChange={handleExpiryDateChange}
            />
          )}

          <PaymentOrderSummary totalAmount={totalAmount} />

          <PaymentButton
            isProcessing={isProcessing}
            totalAmount={totalAmount}
          />

          {errors.general && (
            <p className="text-center text-red-500 mt-2">{errors.general}</p>
          )}

          <p className="text-center text-sm text-gray-500 mt-4">
            By clicking the button above, you agree to our{" "}
            <a href="#" className="text-primary_app hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-primary_app hover:underline">
              Privacy Policy
            </a>
            .
          </p>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage;
