import LoginForm from "../components/loginForm/LoginForm";
import css from "./Login.module.css";

const LoginPage = () => {
  return (
    <>
      <center>
        <h3 className={`${css.loginHeading} fw-bold`}>Login</h3>
        <p>
          If you have an account, sign in with your mobile number or email
          address.
        </p>
      </center>

      <LoginForm />
    </>
  );
};

export default LoginPage;
