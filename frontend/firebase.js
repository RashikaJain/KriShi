// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API,
  authDomain: "vingo-app-a22ea.firebaseapp.com",
  projectId: "vingo-app-a22ea",
  storageBucket: "vingo-app-a22ea.firebasestorage.app",
  messagingSenderId: "1034407128014",
  appId: "1:1034407128014:web:1ffef76dbf5f420deb599f"
};

// Initialize Firebase
// eslint-disable-next-line no-unused-vars
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export {auth,app};