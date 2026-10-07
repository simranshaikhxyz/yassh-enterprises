import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email] = useState(location.state?.email || "");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP code.");
      return;
    }

    try {
      setLoading(true);
      const { data } = await API.post("/auth/verify-otp", { email, otp });
      login(data);

      if (data.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setMessage("");

    try {
      setResendLoading(true);
      const { data } = await API.post("/auth/resend-otp", { email });
      setMessage(data.message || "A new code has been sent.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend code.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6 py-12 text-slate-800 antialiased font-sans">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl border border-slate-200 shadow-sm">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Verify Email
          </h1>
          <p className="text-slate-400 text-sm mt-1.5">
            Enter the 6-digit verification code sent to <br />
            <span className="font-semibold text-slate-700">{email || "your email"}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Verification Code
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
            {loading ? "Verifying..." : "Verify Code"}
          </button>
        </form>

        <div className="text-center mt-6">
          <button
            type="button"
            onClick={handleResend}
            disabled={resendLoading}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 disabled:opacity-50"
          >
            {resendLoading ? "Sending new code..." : "Didn't receive code? Resend"}
          </button>
        </div>

      </div>
    </div>
  );
}

export default VerifyOTP;