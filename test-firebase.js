// Test Firebase connection
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDwbQz09uup2aSAbl381hJN2aH-_kjSIDg",
  authDomain: "petut-pet.firebaseapp.com",
  projectId: "petut-pet",
  storageBucket: "petut-pet.firebasestorage.app",
  messagingSenderId: "572292474316",
  appId: "1:572292474316:web:1280a277451ef13d6d6969"
};

try {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  
  console.log('✅ Firebase initialized successfully');
  console.log('Auth:', !!auth);
  console.log('Firestore:', !!db);
} catch (error) {
  console.error('❌ Firebase initialization failed:', error);
}