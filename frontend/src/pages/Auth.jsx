import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, signupUser } from "../../features/auth/authSlice.js";

export default function Auth() {
  const dispatch = useDispatch();
  const { user, token, loading, error, isAuthenticated } = useSelector((state) => state.auth);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(isLogin) {
      await dispatch(loginUser(formData));
    } else {
      dispatch(signupUser(formData));
    }
  };

  return (
    <div className="bg-white min-h-screen items-center justify-center">
       <h2>{isLogin ? "Login" : "Signup"}</h2>

      <form onSubmit={handleSubmit}>
        {/* Signup only */}
        {!isLogin && (
          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={handleChange}
          />
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : isLogin ? "Login" : "Signup"}
        </button>
      </form>

      {/* Error */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Toggle */}
      <p onClick={() => setIsLogin(!isLogin)} style={{ cursor: "pointer" }}>
        {isLogin
          ? "Don't have an account? Signup"
          : "Already have an account? Login"}
      </p>

      {/* Success */}
      {isAuthenticated && <p>✅ Logged in successfully</p>}
    </div>
  );
}