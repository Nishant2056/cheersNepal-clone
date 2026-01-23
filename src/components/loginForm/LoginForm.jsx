import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../redux/api/apiSlice";
import { setCredentials } from "../../redux/api/authSlice";
import GoogleImg from "../../assets/google-icon.svg";
import FacebookImg from "../../assets/facebook.svg";
import css from "./LoginForm.module.css";

const LoginForm = () => {
  const [username, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   const credentials = { username, password };

  //   try {
  //     const userData = await login(credentials).unwrap();

  //     if (userData?.token) {
  //       localStorage.setItem("token", userData.token);
  //     }

  //     if (typeof userData === "object") {
  //       dispatch(setCredentials({ ...userData }));
  //     } else {
  //       dispatch(setCredentials({ id: userData }));
  //     }

  //     navigate("/dashboard");
  //   } catch (err) {
  //     console.error("Failed to login:", err);
  //   }
  //   setEmail("");
  //   setPassword("");
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login({ username, password }).unwrap();
      navigate("/dashboard");
    } catch (err) {
      console.error("Failed to login:", err);
    }

    setEmail("");
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
    </div>
  );
};

export default LoginForm;
