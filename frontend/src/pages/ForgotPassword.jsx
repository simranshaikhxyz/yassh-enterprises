import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // Step 1: Send OTP, Step 2: Reset Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);
      const { data } = await API.post("/auth/forgot-password", { email });
      setMessage(data.message);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset code.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!otp || !newPassword) {
      setError("Please fill in both OTP and new password.");
      return;
    }

    try {
      setLoading(true);
      const { data } = await API.post("/auth/reset-password", {
        email,
        otp,
        newPassword,
      });
      setMessage(data.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Password reset failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6 py-12 text-slate-800 antialiased font-sans">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl border border-slate-200 shadow-sm">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            {step === 1 ? "Forgot Password" : "Reset Password"}
          </h1>
          <p className="text-slate-400 text-sm mt-1.5">
            {step === 1
              ? "Enter your email to receive a password reset code."
              : `Enter the code sent to ${email}`}
          </p>
        </div>

        {step === 1 ? (
          /* Step 1 Form */
          <form onSubmit={handleRequestOtp} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl p-3 text-sm border border-slate-200 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold rounded-xl p-3.5">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition duration-150 text-sm"
            >
              {loading ? "Sending Code..." : "Send Reset Code"}
            </button>
          </form>
        ) : (
          /* Step 2 Form */
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Reset Code (OTP)
              </label>
              <input
                type="text"
                maxLength={6}
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value.trim())}
                className="w-full text-center tracking-[0.5em] font-mono text-xl rounded-xl p-3 border border-slate-200 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                New Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-xl p-3 text-sm border border-slate-200 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold rounded-xl p-3.5">
                ⚠️ {error}
              </div>
            )}

            {message && (
              <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold rounded-xl p-3.5">
                ✅ {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition duration-150 text-sm"
            >
              {loading ? "Resetting Password..." : "Update Password"}
            </button>
          </form>
        )}

        <p className="text-center mt-6 text-sm text-slate-500 font-medium">
          Remembered your password?{" "}
          <Link
            to="/login"
            className="text-indigo-600 font-semibold hover:text-indigo-700 hover:underline"
          >
            Back to Login
          </Link>
        </p>

      </div>
    </div>
  );
}

export default ForgotPassword;