import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Clinic from "../../components/doctordash/Clinic";
import { RiAddLine } from "react-icons/ri";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db, auth } from "../../firebase.js";
import { BeatLoader } from "react-spinners";
import { toast } from "react-toastify";
import { onAuthStateChanged } from "firebase/auth";
import AddClinicModal from "../../components/AddClinicModal";

export default function Manageclinics() {
  const [loading, setLoading] = useState(true);
  const [clinics, setClinics] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // const [showConfirm, setShowConfirm] = useState(false);

  // get clinics from Firebase
  const getClinics = async (userId) => {
    if (!userId) {
      toast.error("User ID is undefined");
      return;
    }
    setLoading(true);
    try {
      const clinicsRef = collection(db, "clinics");
      const q = query(clinicsRef, where("doctorId", "==", userId));
      const querySnapshot = await getDocs(q);
      const clinicsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setClinics(clinicsData);
    } catch (error) {
      toast.error("Failed to fetch clinics, error:" + error.message, {
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        getClinics(user.uid);
      } else {
        toast.error("User is not logged in.", { autoClose: 3000 });
      }
    });

    return () => unsubscribe(); // cleanup
  }, []);

  // Reset modal state when component mounts
  useEffect(() => {
    setShowAddModal(false);
  }, []);

  //Delete clinic from firebase
  const handleDeleteClinic = async (id) => {
    try {
      await deleteDoc(doc(db, "clinics", id));
      setClinics((clinics) => clinics.filter((clinic) => clinic.id !== id));
      toast.success("Clinic deleted successfully", { autoClose: 3000 });
      // window.location.reload();
    } catch (err) {
      toast.error("Failed to delete clinic, error:" + err.message, {
        autoClose: 3000,
      });
    }
  };
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <nav aria-label="breadcrumb" className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-bold text-xl text-gray-800 mb-1">Clinics</h1>
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <Link
                  to="/doctor-dashboard"
                  className="text-[#C19635] hover:underline"
                >
                  Dashboard
                </Link>
              </li>
              <li className="text-gray-500">/</li>
              <li className="text-gray-700 font-medium">Clinics</li>
            </ol>
          </div>
          <button
            type="button"
            className="btn-primary-petut flex items-center gap-2"
            onClick={() => setShowAddModal(true)}
          >
            <RiAddLine size={20} />
            New Clinic
          </button>
        </div>
      </nav>

      <div className="mb-6">
        <p className="text-gray-600">
          Managing and monitoring the clinics you work in
        </p>
      </div>

      <AddClinicModal
        loading={loading}
        setLoading={setLoading}
        fetchClinics={() => getClinics(auth.currentUser?.uid)}
        showModal={showAddModal}
        setShowModal={setShowAddModal}
      />

      {loading ? (
        <div className="flex justify-center mt-12">
          <BeatLoader color="#C19635" />
        </div>
      ) : clinics.length === 0 ? (
        <div className="text-center mt-12">
          <h3 className="text-xl text-gray-600">No clinics found</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clinics.map((clinic) => (
            <Clinic
              key={clinic.id}
              clinic={clinic}
              onDelete={handleDeleteClinic}
              fetchClinics={() => getClinics(auth.currentUser?.uid)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
