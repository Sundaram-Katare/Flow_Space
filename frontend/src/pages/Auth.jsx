import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginSuccess, signupSuccess } from "../../features/auth/authSlice.js";
import { signup, login } from "../services/auth.js";
import { motion } from "framer-motion";

const images = ["./auth1.png", "./auth2.webp" ];

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [image, setImage] = useState(images[0]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setImage((prev) => {
        const currentIndex = images.indexOf(prev);
        const nextIndex = (currentIndex + 1) % images.length;
        return images[nextIndex];
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [image[0]]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        const data = await login(email, password);
        dispatch(loginSuccess(data));
        navigate("/dashboard");
      } else {
        const data = await signup(email, username, password, firstName, lastName);
        dispatch(signupSuccess(data));
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 bg-gray-100 rounded-3xl overflow-hidden">

        <div className="flex flex-col justify-center px-6 sm:px-10 md:px-14 py-10">
          <h1 className="text-3xl text-center md:text-4xl font-semibold text-gray-800 mb-4">
            Welcome back!
          </h1>

          <p className="text-center text-gray-500 text-sm md:text-base mb-8 leading-relaxed">
            Simplify your workflow and boost your productivity with{" "}
            <span className="font-semibold text-gray-700">FlowSpace</span>. Get started for free.
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {!isLogin && (
              <>
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                  required
                />

                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-1/2 bg-white border border-gray-300 rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-1/2 bg-white border border-gray-300 rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>
              </>
            )}

            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
              required
            />

            {/* <div className="text-right text-sm text-gray-500">
              <span className="cursor-pointer hover:text-gray-700">
                Forgot Password?
              </span>
            </div> */}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-full text-sm font-medium shadow-sm disabled:opacity-50"
            >
              {loading ? "Please wait..." : isLogin ? "Login" : "Create Account"}
            </button>
          </form>

          <p className="text-sm text-gray-500 text-center mt-4">
            {isLogin ? "Not a member?" : "Already have an account?"}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-red-500 font-medium"
            >
              {isLogin ? "Register now" : "Login"}
            </button>
          </p>
        </div>

        <div className="hidden lg:flex items-center justify-center bg-gray-200 rounded-3xl m-4">
          <motion.img
            src={image}
            alt="illustration"
            className="w-[80%] object-contain"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        </div>

      </div>
    </div>
  );
}