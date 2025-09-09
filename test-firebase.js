// Test Firebase connection
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBF-KhHpnMbw2yg1Xjc-HdR9hGVGcDAcf8",
  authDomain: "petcare-petut.firebaseapp.com",
  projectId: "petcare-petut",
  storageBucket: "petcare-petut.firebasestorage.app",
  messagingSenderId: "742449710656",
  appId: "1:742449710656:web:9ae82a65939aa3ab6641a5"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Test function
async function testFirebase() {
  try {
    const docRef = await addDoc(collection(db, "test"), {
      message: "Hello Firebase!",
      timestamp: new Date()
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

testFirebase();