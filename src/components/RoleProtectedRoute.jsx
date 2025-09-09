import React, { useEffect, useState } from 'react';
import { useAuth } from "../context/AuthContext.jsx";
import { useLocation, Navigate } from "react-router-dom";
import LoadingAnimation from "../components/common/LoadingAnimation.jsx";
import {doc, getDoc} from "firebase/firestore";
import {db} from "../firebase.js";

const RoleProtectedRoute = ({ children }) => {
    const { currentUser } = useAuth();
    const [user, setUser] = useState(null);
    const location = useLocation();

    useEffect(() => {
        if (currentUser) {
            const getUserData = async () => {
                try {
                    const userRef = doc(db, "users", currentUser.uid);
                    const userSnap = await getDoc(userRef);
                    if (userSnap.exists()) {
                        setUser(userSnap.data());
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            };
            getUserData();
        }
    }, [currentUser]);

    // Only redirect if not already on the correct dashboard
    if (user?.role === "admin" && !location.pathname.startsWith('/admin-dashboard')) {
        return <Navigate to="/admin-dashboard" replace />;
    }
    
    if (user?.role === "doctor" && !location.pathname.startsWith('/doctor-dashboard')) {
        return <Navigate to="/doctor-dashboard" replace />;
    }

    return children;
};

export default RoleProtectedRoute;
