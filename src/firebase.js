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

// Validate required environment variables
if (!import.meta.env.VITE_FIREBASE_API_KEY) {
  console.error('Missing VITE_FIREBASE_API_KEY');
  throw new Error('Missing required environment variable: VITE_FIREBASE_API_KEY');
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

console.log('Firebase config:', {
  apiKey: firebaseConfig.apiKey ? '✅' : '❌',
  authDomain: firebaseConfig.authDomain ? '✅' : '❌',
  projectId: firebaseConfig.projectId ? '✅' : '❌'
});

let app;
try {
  app = initializeApp(firebaseConfig);
  console.log('✅ Firebase app initialized');
} catch (error) {
  console.error('❌ Firebase initialization failed:', error);
  throw error;
}

// Services
let auth, db, messaging;
try {
  auth = getAuth(app);
  console.log('✅ Firebase Auth initialized');
} catch (error) {
  console.error('❌ Firebase Auth failed:', error);
  throw error;
}

try {
  db = getFirestore(app);
  console.log('✅ Firestore initialized');
} catch (error) {
  console.error('❌ Firestore failed:', error);
  throw error;
}

try {
  messaging = getMessaging(app);
  console.log('✅ Firebase Messaging initialized');
} catch (error) {
  console.warn('⚠️ Firebase Messaging failed (may not be available in dev):', error.message);
}
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
