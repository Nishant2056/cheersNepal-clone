import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../redux/api/apiSlice";
import GoogleImg from "../../assets/google-icon.svg";
import FacebookImg from "../../assets/facebook.svg";
import css from "./LoginForm.module.css";

const LoginForm = () => {
  const [username, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const toastTimer = useRef(null);

  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();

  const showToastMessage = (message, duration = 3000) => {
    setToastMessage(message);
    setShowToast(true);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setShowToast(false), duration);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login({ username, password }).unwrap();
      showToastMessage("Login successful!");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      console.error("Failed to login:", err);
      showToastMessage("Invalid username or password");
    }
    setPassword("");
  };

  return (
    <div className={` ${css.myLoginForm} container`}>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Email or Mobile No.
          </label>
          <input
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            value={username}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="exampleInputPassword1"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="exampleCheck1"
          />
          <label className="form-check-label" htmlFor="exampleCheck1">
            Remember me
          </label>
          <a href="#" className="float-end text-danger text-decoration-none">
            {" "}
            Forgot your password?
          </a>
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100 fw-bold"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
      <div className="row align-items-center mt-4 mb-4">
        <div className="col">
          <hr />
        </div>

        <div className="col-auto">
          <span className="text-muted">OR</span>
        </div>

        <div className="col">
          <hr />
        </div>
      </div>
      <button className="btn btn-google w-100">
        <img src={GoogleImg} alt="Google" />
        <span>
          Login in with <strong>Google</strong>
        </span>
      </button>
      <br />
      <button className="btn btn-google mt-2 w-100">
        <img src={FacebookImg} alt="Google" />
        <span>
          Login in with <strong>facebook</strong>
        </span>
      </button>
      <br />
      <center>
        <p>
          Don’t have an account?{" "}
          <a href="#" className="text-black">
            Register here
          </a>{" "}
        </p>
      </center>
      {/* Toast */}
      <div
        className="toast-container position-fixed top-0 end-0 p-3"
        style={{ zIndex: 999 }}
      >
        <div
          className={`toast ${showToast ? "show" : ""}`}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="toast-header">
            <strong className="me-auto">Message</strong>
          </div>
          <div
            className={`toast-body ${
              toastMessage === "Login successful!"
                ? "text-success"
                : "text-danger"
            }`}
          >
            {toastMessage}
          </div>
        </div>
      </div>{" "}
    </div>
  );
};

export default LoginForm;
