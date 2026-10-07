import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const { userInfo, logout } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(userInfo?.name || "");
  const [email, setEmail] = useState(userInfo?.email || "");
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name || "");
      setEmail(userInfo.email || "");
    }
  }, [userInfo]);

  const handleSave = () => {
    const updatedUser = {
      ...userInfo,
      name,
      email,
    };

    localStorage.setItem("userInfo", JSON.stringify(updatedUser));
    
    // Show a clean temporary success notification instead of a jarring browser alert
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      window.location.reload(); 
    }, 1500);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!userInfo) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center px-6 text-center">
        <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-slate-950 mb-1">Authentication Required</h3>
        <p className="text-slate-500 text-sm font-medium mb-5">Please sign in to view your profile settings.</p>
        <button 
          onClick={() => navigate("/login")}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition duration-150 shadow-sm"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-16 px-6 antialiased font-sans">
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        
        {/* Profile Card Header */}
        <div className="border-b border-slate-100 p-8 text-center bg-slate-50/50">
          <div className="w-16 h-16 mx-auto bg-indigo-50 border border-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-2xl mb-4">
            {name.charAt(0).toUpperCase() || "U"}
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Account Management
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Review and adjust your profile information parameters
          </p>
        </div>

        {/* Configuration Panel Body */}
        <div className="p-8 space-y-6">
          
          {saveSuccess && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-semibold transition duration-200 animate-fade-in">
              <svg className="w-5 h-5 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Profile changes saved successfully! Reloading...
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-slate-800 placeholder-slate-400 bg-white border border-slate-250 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition duration-150"
              placeholder="Enter full name"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-slate-800 placeholder-slate-400 bg-white border border-slate-250 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition duration-150"
              placeholder="name@company.com"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2">
              Access Scope
            </label>
            <div className="relative">
              <input
                type="text"
                value={userInfo.isAdmin ? "Administrator" : "Standard Client"}
                readOnly
                className="w-full text-slate-500 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold select-none cursor-not-allowed"
              />
              <div className="absolute right-4 top-3.5 text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Form Trigger Matrix */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-100">
            <button
              onClick={handleSave}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm py-3 px-4 rounded-xl shadow-sm transition duration-150"
            >
              Save Changes
            </button>

            <button
              onClick={handleLogout}
              className="flex-1 bg-white hover:bg-rose-50 border border-slate-250 text-rose-600 font-semibold text-sm py-3 px-4 rounded-xl transition duration-150"
            >
              Logout Account
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Profile;