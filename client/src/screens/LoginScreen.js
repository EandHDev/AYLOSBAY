import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./AuthScreens.css";

function LoginScreen() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      
      // Use the SAME proxy that works for your rooms
      const response = await axios.post(
        `https://api.codetabs.com/v1/proxy?quest=http://booking-app-backend-env.eba-mnfnnxen.us-east-1.elasticbeanstalk.com/api/users/login`,
        {
          email: formData.email,
          password: formData.password,
        }
      );

      // Store the user data
      localStorage.setItem("currentUser", JSON.stringify(response.data.user));

      // Navigate to home page
      navigate("/");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-control"
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="form-control"
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="auth-link">
          Don't have an account?{" "}
          <Link to="/register">Click here to register</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginScreen;
