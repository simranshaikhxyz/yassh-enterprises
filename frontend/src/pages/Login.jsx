import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // --------------------------------------------------
  // FORM VALIDATION
  // --------------------------------------------------
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // --------------------------------------------------
  // HANDLE INPUT CHANGE
  // --------------------------------------------------
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: "",
    });

    setServerError("");
  };

  // --------------------------------------------------
  // LOGIN
  // --------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!validateForm()) return;

    try {
      setLoading(true);

      const { data } = await API.post("/auth/login", formData);

      login(data);

      if (data.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        "Invalid email or password.";

      // If user is not verified, go to OTP verification
      if (error.response?.data?.isVerified === false) {
        navigate("/verify-otp", {
          state: {
            email: formData.email,
          },
        });

        return;
      }

      setServerError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6 py-12 text-slate-800 antialiased font-sans">

      {/* =====================================================
          LOGIN CARD
      ===================================================== */}
      <div className="bg-white w-full max-w-md p-8 rounded-2xl border border-slate-200 shadow-sm animate-[fadeInUp_0.6s_ease-out]">

        {/* =================================================
            HEADER
        ================================================= */}
        <div className="text-center mb-8 animate-[fadeIn_0.8s_ease-out]">

          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Welcome Back
          </h1>

          <p className="text-slate-400 text-sm mt-1.5">
            Log in to manage fabrication pipelines and orders.
          </p>

        </div>


        {/* =================================================
            FORM
        ================================================= */}
        <form onSubmit={handleSubmit} className="space-y-5">


          {/* =================================================
              EMAIL
          ================================================= */}
          <div>

            <label
              htmlFor="email"
              className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2"
            >
              Email Address
            </label>

            <input
              id="email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="name@company.com"
              value={formData.email}
              onChange={handleChange}
              className={`w-full rounded-xl p-3 text-sm border outline-none transition-all duration-200 focus:ring-4 ${
                errors.email
                  ? "border-rose-300 focus:border-rose-400 focus:ring-rose-500/10"
                  : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/10"
              }`}
            />

            {errors.email && (
              <p className="text-rose-600 text-xs font-semibold mt-1.5 flex items-center gap-1 animate-[fadeInUp_0.3s_ease-out]">
                ⚠️ {errors.email}
              </p>
            )}

          </div>


          {/* =================================================
              PASSWORD
          ================================================= */}
          <div>

            <div className="flex items-center justify-between mb-2">

              <label
                htmlFor="password"
                className="block text-xs font-bold text-slate-500 uppercase tracking-wider"
              >
                Password
              </label>

              <Link
                to="/forgot-password"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline transition-all duration-200"
              >
                Forgot password?
              </Link>

            </div>


            <div className="relative">

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className={`w-full rounded-xl p-3 text-sm border outline-none transition-all duration-200 pr-12 focus:ring-4 ${
                  errors.password
                    ? "border-rose-300 focus:border-rose-400 focus:ring-rose-500/10"
                    : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/10"
                }`}
              />


              {/* SHOW / HIDE PASSWORD */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
                className="absolute right-3.5 top-3 text-slate-400 hover:text-indigo-600 hover:scale-110 transition-all duration-200 focus:outline-none"
              >

                {showPassword ? (

                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                    />
                  </svg>

                ) : (

                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />

                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z"
                    />
                  </svg>

                )}

              </button>

            </div>


            {errors.password && (
              <p className="text-rose-600 text-xs font-semibold mt-1.5 flex items-center gap-1 animate-[fadeInUp_0.3s_ease-out]">
                ⚠️ {errors.password}
              </p>
            )}

          </div>


          {/* =================================================
              SERVER ERROR
          ================================================= */}
          {serverError && (

            <div className="bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold rounded-xl p-3.5 flex items-center gap-2 animate-[fadeInUp_0.3s_ease-out]">

              <svg
                className="w-4 h-4 shrink-0 text-rose-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />

              </svg>

              <span>{serverError}</span>

            </div>

          )}


          {/* =================================================
              SIGN IN BUTTON
          ================================================= */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl shadow-sm transition-all duration-200 flex items-center justify-center gap-2 text-sm"
          >

            {loading ? (

              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >

                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />

                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />

                </svg>

                Signing In...
              </>

            ) : (

              "Sign In"

            )}

          </button>

        </form>


        {/* =================================================
            REGISTER
        ================================================= */}
        <p className="text-center mt-6 text-sm text-slate-500 font-medium">

          Don't have an account?{" "}

          <Link
            to="/register"
            className="text-indigo-600 font-semibold hover:text-indigo-700 hover:underline transition-all duration-200"
          >
            Register here
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Login;