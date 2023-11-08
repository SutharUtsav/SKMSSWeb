import React from "react";
import "./Login.css";
import logo from "../../icons/SamajLogo.png";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="d-flex flex-column align-items-center justify-content-center">
          <div className="logo my-auto">
            <img src={logo} alt="logo" />
          </div>

          <form className="login-first-form">
            <div className=" text-center">
              <h3 className="fs-1">Login</h3>
              <span className="fs-4 fw-light mt-2">
                Hey there! Enter your details to get sign in to your account.
              </span>
            </div>

            <div className="raw mt-5">
              <div>
                <label htmlFor="email" className="form-label fs-3">
                  Email Address
                </label>
                <i className="text-danger fs-3">*</i>
                <input
                  id="email"
                  type="email"
                  required={true}
                  placeholder="Enter Your Email Address"
                  className="form-control fs-3 fw-light mt-1"
                  name="email"
                />
              </div>

              <div className="mt-4">
                <label htmlFor="password" className="form-label fs-3">
                  Password
                </label>
                <i className="text-danger fs-3">*</i>
                <input
                  id="password"
                  type="password"
                  required={true}
                  placeholder="Enter Your Password"
                  className="form-control fs-3 fw-light mt-1"
                  name="password"
                />
              </div>

              <button
                type="submit"
                className="btn btn-submit m-2 px-4 py-2 mt-4 fs-3 fw-normal rounded"
              >
                Login
              </button>
            </div>

            <div className="oval-container">
              <div className="oval">
                <span className="separator-text">
                  <div className="or">OR</div>
                </span>
              </div>
            </div>

            <div className="google-sign-in text-center mt-2">
              <span className="fs-4 fw-light">Sign In with</span>
              <button className="border p-3 ml-3 bg-none">
                <FcGoogle size={"2rem"}/>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
