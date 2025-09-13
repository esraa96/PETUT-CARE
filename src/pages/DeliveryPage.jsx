import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

// Import the new reusable components
import DeliveryHeader from "../components/delivery/DeliveryHeader";
import ContactInfoForm from "../components/delivery/ContactInfoForm";
import AddressForm from "../components/delivery/AddressForm";
import DeliveryMethodSelector from "../components/delivery/DeliveryMethodSelector";
import DeliveryTimeSelector from "../components/delivery/DeliveryTimeSelector";
import OrderSummary from "../components/delivery/OrderSummary";

const DeliveryPage = () => {
  const navigate = useNavigate();
  const { totalAmount } = useSelector((state) => state.cart);

  const [deliveryInfo, setDeliveryInfo] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    deliveryMethod: "standard",
    deliveryTime: "anytime",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDeliveryInfo((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!deliveryInfo.fullName.trim())
      newErrors.fullName = "Full name is required";
    if (!deliveryInfo.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10,}$/.test(deliveryInfo.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Please enter a valid phone number";
    }
    if (!deliveryInfo.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(deliveryInfo.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!deliveryInfo.address.trim()) newErrors.address = "Address is required";
    if (!deliveryInfo.city.trim()) newErrors.city = "City is required";
    if (!deliveryInfo.postalCode.trim())
      newErrors.postalCode = "Postal code is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      navigate("/payment", { state: { deliveryInfo } });
    }
  };

  // Data for the selectors
  const deliveryMethods = [
    {
      id: "standard",
      name: "Standard Delivery",
      price: 0,
      description: "Delivery within 3-5 business days",
    },
    {
      id: "express",
      name: "Express Delivery",
      price: 9.99,
      description: "Delivery within 1-2 business days",
    },
    {
      id: "pickup",
      name: "Store Pickup",
      price: 0,
      description: "Pickup from our store",
    },
  ];

  const deliveryTimes = [
    { id: "anytime", name: "Anytime" },
    { id: "morning", name: "Morning (8:00 - 12:00)" },
    { id: "afternoon", name: "Afternoon (12:00 - 17:00)" },
    { id: "evening", name: "Evening (17:00 - 21:00)" },
  ];

  const selectedMethod = deliveryMethods.find(
    (method) => method.id === deliveryInfo.deliveryMethod
  );
  const deliveryFee = selectedMethod ? selectedMethod.price : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <DeliveryHeader />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <ContactInfoForm
                deliveryInfo={deliveryInfo}
                handleChange={handleChange}
                errors={errors}
              />

              <AddressForm
                deliveryInfo={deliveryInfo}
                handleChange={handleChange}
                errors={errors}
              />

              <DeliveryMethodSelector
                deliveryMethods={deliveryMethods}
                selectedMethod={deliveryInfo.deliveryMethod}
                handleChange={handleChange}
              />

              <DeliveryTimeSelector
                deliveryTimes={deliveryTimes}
                selectedTime={deliveryInfo.deliveryTime}
                handleChange={handleChange}
              />
            </form>
          </div>
          
          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-32">
              <OrderSummary totalAmount={totalAmount} deliveryFee={deliveryFee} />
              
              <button
                type="submit"
                onClick={handleSubmit}
                className="w-full mt-6 py-4 bg-gradient-to-r from-primary_app to-primary_app/80 hover:from-primary_app/90 hover:to-primary_app/70 text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <i className="fas fa-credit-card"></i>
                Continue to Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryPage;
