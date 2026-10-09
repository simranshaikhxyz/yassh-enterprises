
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
    ) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setServerError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!validateForm()) return;

    try {
      setLoading(true);

      const { data } = await API.post("/auth/login", {
        email: formData.email.trim(),
        password: formData.password,
      });

      // Backend returns the customer inside data.user.
      if (!data?.user) {
        throw new Error("Invalid login response. Please try again.");
      }

      const loggedInUser = {
        ...data.user,
        token: data.token,
      };

      // Store the actual user object, not the entire API response.
      login(loggedInUser);

      if (loggedInUser.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Invalid email or password.";

      if (
        error.response?.data?.requiresVerification ||
        error.response?.data?.isVerified === false
      ) {
        navigate("/verify-otp", {
          state: {
            email: formData.email.trim(),
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
      <div className="bg-white w-full max-w-md p-8 rounded-2xl border border-slate-200 shadow-sm animate-[fadeInUp_0.6s_ease-out]">
        <div className="text-center mb-8 animate-[fadeIn_0.8s_ease-out]">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Welcome Back
          </h1>
          <p className="text-slate-400 text-sm mt-1.5">
            Log in to manage fabrication pipelines and orders.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
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
              <p className="text-rose-600 text-xs font-semibold mt-1.5">
                ⚠️ {errors.email}
              </p>
            )}
          </div>

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
                className={`w-full rounded-xl p-3 text-sm border outline-none pr-12 transition-all duration-200 focus:ring-4 ${
                  errors.password
                    ? "border-rose-300 focus:border-rose-400 focus:ring-rose-500/10"
                    : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/10"
                }`}
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-indigo-600 transition-all duration-200"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M3 3l18 18"
                    />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>

            {errors.password && (
              <p className="text-rose-600 text-xs font-semibold mt-1.5">
                ⚠️ {errors.password}
              </p>
            )}
          </div>

          {serverError && (
            <div className="bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold rounded-xl p-3.5">
              {serverError}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl shadow-sm transition-all duration-200 flex items-center justify-center gap-2 text-sm"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

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

