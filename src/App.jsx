import { useEffect, useRef } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "./context/AuthContext";
import { fetchFavorites } from "./store/slices/favoritesSlice";
import {
  loadCartFromFirestore,
  saveCartToFirestore,
  clearCart,
} from "./store/slices/cartSlice";
import Layout from "./components/Layout/Layout";
import HomePage from "./pages/HomePage";
import CatalogPage from "./pages/CatalogPage";
import FilterPage from "./pages/FilterPage";
import ProductPage from "./pages/ProductPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import DeliveryPage from "./pages/DeliveryPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import CartPage from "./pages/CartPage";
import PaymentPage from "./pages/PaymentPage";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "./components/ProtectedRoute";
import FavoritesPage from "./pages/FavoritesPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import ClinicsScreen from "./pages/ClinicsScreen";
import ClinicDetailsScreen from "./pages/ClinicDetailsScreen";
import BookingConfirmationPage from "./pages/BookingConfirmationPage";
import BookingLoadingPage from "./pages/BookingLoadingPage";
import BookingSuccessPage from "./pages/BookingSuccessPage";
import CompleteProfile from "./pages/CompleteProfile.jsx";
import NotFoundPage from "./pages/NotFoundPage";
import DoctorDashboard from './pages/doctordashboard/DoctorPage'
import HelloDoctor from './pages/doctordashboard/HelloDoctor'
import ManageUsers from './pages/admin-dashboard/ManageUsers'
import HelloAdmin from './pages/admin-dashboard/HelloAdmin'
import Overview from './pages/admin-dashboard/Overview'
import AdminDashboard from './pages/admin-dashboard/AdminPage'
import Manageclinics from './pages/doctordashboard/ManageClinics'
import Manageprofile from './pages/doctordashboard/ManageProfile'
import Manageclients from './pages/doctordashboard/ManageClients'
import Manageappointments from './pages/doctordashboard/ManageAppointments'
import { ToastContainer } from 'react-toastify'
import ManageClinics from './pages/admin-dashboard/ManageClinics'
import ManageReservations from './pages/admin-dashboard/ManageReservations'
import Charts from './pages/admin-dashboard/Charts'
import Reviews from './pages/admin-dashboard/Reviews'
import Store from './pages/admin-dashboard/Store'
import SupportPage from './pages/admin-dashboard/SupportPage'
import AdminNotificationsPage from './pages/admin-dashboard/NotificationsPage'
import ContactUsPage from './pages/ContactUsPage'
import MyTicketsPage from './pages/MyTicketsPage'
import SupportChatPage from './pages/SupportChatPage'
import NotificationsPage from './pages/NotificationsPage'
import RoleProtectedRoute from "./components/RoleProtectedRoute.jsx";
import RoleSelectionPage from "./pages/RoleSelectionPage";
import Notification from "./components/Notification1/Notification.jsx";
import CommunityScreen from "./pages/CommunityScreen";
import ChatsListScreen from "./pages/ChatsListScreen";
import CreatePostScreen from "./pages/CreatePostScreen";
import PostDetailsScreen from "./pages/PostDetailsScreen";
import ProfileViewScreen from "./pages/ProfileViewScreen";
import EditPostScreen from "./pages/EditPostScreen";
import BreedIdentifierPage from './pages/BreedIdentifierPage';
function App() {
  const dispatch = useDispatch();
  const { currentUser } = useAuth();
  const cart = useSelector((state) => state.cart);
  const prevUserRef = useRef();
  const prevCartRef = useRef(cart);



  useEffect(() => {
    // منع تهيئة OneSignal أكتر من مرة
    if (window.OneSignal && !window.__oneSignalInitialized) {
      window.__oneSignalInitialized = true;
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      dispatch(fetchFavorites(currentUser.uid));
    }
  }, [currentUser, dispatch]);

  // On login/logout: sync cart
  useEffect(() => {
    const prevUser = prevUserRef.current;
    if (currentUser && !prevUser) {
      // User just logged in: merge guest cart with Firestore cart
      dispatch(loadCartFromFirestore(currentUser.uid)).then((action) => {
        const firestoreCart = action.payload || {
          items: [],
          totalQuantity: 0,
          totalAmount: 0,
        };
        // Merge guest cart (Redux) and Firestore cart
        const mergedItems = [...(firestoreCart.items || [])];
        (cart.items || []).forEach((guestItem) => {
          const existing = mergedItems.find((item) => item.id === guestItem.id);
          if (existing) {
            existing.quantity += guestItem.quantity;
            existing.totalPrice = existing.price * existing.quantity;
          } else {
            mergedItems.push({ ...guestItem });
          }
        });
        const mergedCart = {
          items: mergedItems,
          totalQuantity: mergedItems.reduce(
            (sum, item) => sum + item.quantity,
            0
          ),
          totalAmount: mergedItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          ),
        };
        dispatch(
          saveCartToFirestore({ uid: currentUser.uid, cart: mergedCart })
        ).then(() => {
          // Load merged cart into Redux
          dispatch(loadCartFromFirestore(currentUser.uid));
        });
      });
    } else if (!currentUser && prevUser) {
      // User just logged out: clear cart (guest cart is empty)
      dispatch(clearCart());
    }
    prevUserRef.current = currentUser;
    // eslint-disable-next-line
  }, [currentUser, dispatch]);

  // On cart change: save to Firestore if logged in
  useEffect(() => {
    const prevCart = prevCartRef.current;
    if (
      currentUser &&
      prevCart &&
      (prevCart.items !== cart.items ||
        prevCart.totalQuantity !== cart.totalQuantity ||
        prevCart.totalAmount !== cart.totalAmount)
    ) {
      dispatch(saveCartToFirestore({ uid: currentUser.uid, cart }));
    }
    prevCartRef.current = cart;
    // eslint-disable-next-line
  }, [cart, currentUser, dispatch]);

  return (
    <>
      <Notification />
      <ToastContainer />
      <Routes>
        <Route path="/doctor-dashboard" element={<DoctorDashboard />}>
          <Route index element={<HelloDoctor />} />
          <Route path="manage-clients" element={<Manageclients />} />
          <Route path="manage-appointments" element={<Manageappointments />} />
          <Route path="manage-clinics" element={<Manageclinics />} />
          <Route path="manage-profile" element={<Manageprofile />} />
        </Route>
        <Route path="/admin-dashboard" element={<AdminDashboard />}>
          <Route index element={<HelloAdmin />} />
          <Route path="overview" element={<Overview />} />
          <Route path="manage-users" element={<ManageUsers />} />
          <Route path="manage-clinics" element={<ManageClinics />} />
          <Route path="manage-reservations" element={<ManageReservations />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="store" element={<Store />} />
          <Route path="charts" element={<Charts />} />
          <Route path="notifications" element={<AdminNotificationsPage />} />
           <Route path="support" element={<SupportPage />} />
        </Route>
        <Route
          path="/"
          element={
            <RoleProtectedRoute>
              <Layout />
            </RoleProtectedRoute>
          }
        >
          <Route index element={<HomePage />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="catalog" element={<CatalogPage />} />
          <Route path="filters" element={<FilterPage />} />
          <Route path="product/:productId" element={<ProductPage />} />
          <Route path="/identify" element={<BreedIdentifierPage />} />
          <Route
            path="delivery"
            element={
              <ProtectedRoute>
                <DeliveryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="order-confirmation"
            element={
              <ProtectedRoute>
                <OrderConfirmationPage />
              </ProtectedRoute>
            }
          />
          <Route path="cart" element={<CartPage />} />
          <Route
            path="payment"
            element={
              <ProtectedRoute>
                <PaymentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="favorites"
            element={
              <ProtectedRoute>
                <FavoritesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order/:orderId"
            element={
              <ProtectedRoute>
                <OrderDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route path="clinics" element={<ClinicsScreen />} />
          <Route
            path="ClinicDetailsScreen"
            element={
              <ProtectedRoute>
                <ClinicDetailsScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/booking-confirmation"
            element={
              <ProtectedRoute>
                <BookingConfirmationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/booking-loading"
            element={
              <ProtectedRoute>
                <BookingLoadingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/booking-success"
            element={
              <ProtectedRoute>
                <BookingSuccessPage />
              </ProtectedRoute>
            }
          />
          <Route
                      path="community"
                      element={
                        <ProtectedRoute>
                          <CommunityScreen />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="chats"
                      element={
                        <ProtectedRoute>
                          <ChatsListScreen />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="create-post"
                      element={
                        <ProtectedRoute>
                          <CreatePostScreen />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="post/:postId"
                      element={
                        <ProtectedRoute>
                          <PostDetailsScreen />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="profile/:userId"
                      element={
                        <ProtectedRoute>
                          <ProfileViewScreen />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="edit-post/:postId"
                      element={
                        <ProtectedRoute>
                          <EditPostScreen />
                        </ProtectedRoute>
                      }
                    />
          
                    <Route
                      path="contact-us"
                      element={
                        <ProtectedRoute>
                          <ContactUsPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="my-tickets"
                      element={
                        <ProtectedRoute>
                          <MyTicketsPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="support-chat/:ticketId"
                      element={
                        <ProtectedRoute>
                          <SupportChatPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="notifications"
                      element={
                        <ProtectedRoute>
                          <NotificationsPage />
                        </ProtectedRoute>
                      }
                    />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
        <Route path="/role-selection" element={<RoleSelectionPage />} />
      </Routes>
    </>
  );
}

export default App;
