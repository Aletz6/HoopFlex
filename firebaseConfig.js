// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBccvRFgz6-kFjQnM_dPZCBIeGW48Fx7jY",
    authDomain: "hoopflex-f5f97.firebaseapp.com",
    projectId: "hoopflex-f5f97",
    storageBucket: "hoopflex-f5f97.firebasestorage.app",
    messagingSenderId: "167077999574",
    appId: "1:167077999574:web:4cbd6a0b889acb28faaa77",
    measurementId: "G-NMBFPMKV0Z"
  };
  

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
