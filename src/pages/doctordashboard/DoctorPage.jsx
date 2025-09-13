import { Fragment, useEffect, useState } from "react";
import HeaderDoctor from "../../components/HeaderDoctor";
import Sidebar from "../../components/doctordash/Sidebar";
import ContentDoctorDash from "./../../components/doctordash/ContentDoctorDash";
import { auth, db } from "../../firebase";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import "../../styles/doctorDashboard.css";

export default function DoctorDashboard() {
  const [sidebarOpen, setsidebarOpen] = useState(false);
  const [doctorData, setDoctorData] = useState([]);

  const toggleSidebar = () => {
    setsidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    let unsubscribeDoc = null;
    
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        
        unsubscribeDoc = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.role === "doctor") {
              setDoctorData(data);
            }
          }
        });
      } else {
        setDoctorData([]);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeDoc) {
        unsubscribeDoc();
      }
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <HeaderDoctor toggleSidebar={toggleSidebar} doctorData={doctorData} />
      <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />
      <ContentDoctorDash
        open={sidebarOpen}
        doctorData={doctorData}
        setDoctorData={setDoctorData}
      />
    </div>
  );
}
