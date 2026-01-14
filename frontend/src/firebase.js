// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDVO6Lw3qH_tc-JapS9qsRJrLqy3Zs6gx8",
  authDomain: "mediverse-89644.firebaseapp.com",
  projectId: "mediverse-89644",
  storageBucket: "mediverse-89644.firebasestorage.app",
  messagingSenderId: "915325616944",
  appId: "1:915325616944:web:3dc2d829f1d68a9dbd7ef5"
};

//3. Initialize Firebase
const app = initializeApp(firebaseConfig);
// 4. Auth aur Google Provider ko export karein (Ye zaroori hai)
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();