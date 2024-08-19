import { useState, useEffect } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import config from "../../config/config";
import MessageModal from "../MessageModal";
import { Link, useNavigate } from "react-router-dom";
import { getAuthDetails } from "../../utils/authUtils";
import "./index.css";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const { token } = getAuthDetails();
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, password } = formData;

    if (!username || !password) {
      setMessage("Please fill in both fields");
      setMessageType("error");
      setShowModal(true);
      return;
    }

    try {
      const response = await axios.post(
        `${config.apiUrl}/users/login`,
        formData
      );
      const { message, token } = response.data;
      setMessage(message);
      setMessageType("success");
      setShowModal(true);
      localStorage.setItem("token", token);
      navigate("/");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Login failed. Please try again.";
      setMessage(errorMessage);
      setMessageType("error");
      setShowModal(true);
    }
  };

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div>
      <div className="BgContainer">
        <form className="form" onSubmit={handleSubmit}>
          <h1 className="conatinername">Login</h1>
          <div className="FieldContainer">
            <label htmlFor="username" className="form-label">
              USERNAME
            </label>
            <input
              type="text"
              id="username"
              className="InputField Logininput"
              placeholder="user"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div className="FieldContainer">
            <label htmlFor="password" className="form-label">
              PASSWORD
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="InputField Logininput"
              placeholder="Theuser@1"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="FieldContainer">
            <span className="password-icon" onClick={togglePassword}>
              {showPassword ? (
                <FaEyeSlash className="icons" />
              ) : (
                <FaEye className="icons" />
              )}
              <p className="HidePass">
                {showPassword ? "hide password" : "show password"}
              </p>
            </span>
            <button type="submit" className="button">
              Login
            </button>
          </div>
        </form>
        <Link to="/register" className="reg-link">
          Don't have an account? Register
        </Link>
      </div>
      {showModal && (
        <MessageModal
          message={message}
          messageType={messageType}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default Login;
