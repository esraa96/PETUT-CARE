import React, { useEffect, useState } from 'react';
import { useAuth } from "../context/AuthContext.jsx";
import { useLocation, Navigate } from "react-router-dom";
import LoadingAnimation from "../components/common/LoadingAnimation.jsx";
import {doc, getDoc} from "firebase/firestore";
import {db} from "../firebase.js";

const RoleProtectedRoute = ({ children, requiredRole }) => {
    const { currentUser } = useAuth();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
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
                } finally {
                    setLoading(false);
                }
            };
            getUserData();
        } else {
            setLoading(false);
        }
    }, [currentUser]);

    if (loading) {
        return <LoadingAnimation />;
    }

    // If requiredRole is specified, check if user has that role
    if (requiredRole && user?.role !== requiredRole) {
        // Redirect to appropriate dashboard or login
        if (!user) {
            return <Navigate to="/login" replace />;
        }
        if (user.role === "admin") {
            return <Navigate to="/admin-dashboard" replace />;
        }
        if (user.role === "doctor") {
            return <Navigate to="/doctor-dashboard" replace />;
        }
        return <Navigate to="/" replace />;
    }

    // Auto-redirect based on role if no specific role required
    if (!requiredRole) {
        if (user?.role === "admin" && !location.pathname.startsWith('/admin-dashboard')) {
            return <Navigate to="/admin-dashboard" replace />;
        }
        
        if (user?.role === "doctor" && !location.pathname.startsWith('/doctor-dashboard')) {
            return <Navigate to="/doctor-dashboard" replace />;
        }
    }

    return children;
};

export default RoleProtectedRoute;
