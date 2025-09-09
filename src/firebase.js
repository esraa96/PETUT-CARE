// firebase.js

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  enableNetwork,
  disableNetwork,
  connectFirestoreEmulator
} from "firebase/firestore";

import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDwbQz09uup2aSAbl381hJN2aH-_kjSIDg",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "petut-pet.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "petut-pet",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "petut-pet.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "572292474316",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:572292474316:web:1280a277451ef13d6d6969",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-S2BZ5ZZSE4"
};

const app = initializeApp(firebaseConfig);

// Services
const auth = getAuth(app);
const db = getFirestore(app);
const messaging = getMessaging(app);
// Google Sign-in
const googleProvider = new GoogleAuthProvider();
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);

// Exports
export { auth, db, messaging, getToken, onMessage };

// Firestore Utility Functions

export async function getUserCart(uid) {
  const cartRef = doc(db, "users", uid, "cart", "cart");
  const cartSnap = await getDoc(cartRef);
  return cartSnap.exists() ? cartSnap.data() : null;
}

export async function setUserCart(uid, cart) {
  if (!uid || !cart) return;
  
  const cartRef = doc(db, "users", uid, "cart", "cart");
  const safeCart = {
    items: cart.items || [],
    totalQuantity: cart.totalQuantity || 0,
    totalAmount: cart.totalAmount || 0
  };
  try {
    await setDoc(cartRef, safeCart);
  } catch (error) {
    console.error('Error saving cart:', error);
  }
}

export async function deleteUserCart(uid) {
  const cartRef = doc(db, "users", uid, "cart", "cart");
  await deleteDoc(cartRef);
}

export async function placeOrder(uid, orderData) {
  const { orderId } = orderData;
  if (!orderId) {
    throw new Error("Order ID is missing");
  }

  // Reference to the main order document
  const mainOrderRef = doc(db, "orders", orderId);
  await setDoc(mainOrderRef, orderData);

  // Reference to the user's specific order document
  const userOrderRef = doc(db, "users", uid, "orders", orderId);
  await setDoc(userOrderRef, orderData);

  return orderId;
}

export async function getUserOrders(uid) {
  const ordersRef = collection(db, "users", uid, "orders");
  const querySnapshot = await getDocs(ordersRef);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function updateOrderStatus(uid, orderId, status) {
  const userOrderRef = doc(db, "users", uid, "orders", orderId);
  const mainOrderRef = doc(db, "orders", orderId);

  await updateDoc(userOrderRef, { status });
  await updateDoc(mainOrderRef, { status });
}

export async function getUserProfile(uid) {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? userSnap.data() : null;
}

export const setUserProfile = async (uid, data) => {
  console.log('setUserProfile called with:', uid, data);
  const userDocRef = doc(db, "users", uid);
  // Use { merge: true } to update fields without overwriting the entire document
  await setDoc(userDocRef, data, { merge: true });
  console.log('Data saved to Firebase successfully');
};
