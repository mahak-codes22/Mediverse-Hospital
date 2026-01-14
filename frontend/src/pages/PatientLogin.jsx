import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider } from '../firebase'; // Import firebase
import { signInWithPopup } from "firebase/auth";

const PatientLogin = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      console.log("User Info:", user);
      alert(`Welcome ${user.displayName}! Login Successful.`);
      
      // Login hone ke baad Home page par bhej do
      navigate('/'); 
    } catch (error) {
      console.error(error);
      alert("Login Failed: " + error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
        <h1 className="text-3xl font-black text-slate-800 mb-2">Patient Login</h1>
        <p className="text-slate-500 mb-8">Access your appointments & reports</p>

        {/* Google Button */}
        <button 
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white border border-slate-300 p-3 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-all hover:shadow-md"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6" alt="Google" />
          Continue with Google
        </button>

        <div className="mt-6 text-xs text-slate-400">
          By continuing, you agree to MediVerse Terms & Privacy Policy.
        </div>
      </div>
    </div>
  );
};

export default PatientLogin;