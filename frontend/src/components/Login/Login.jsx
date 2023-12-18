import React, { useState, useEffect, useRef } from "react";
import "./Login.css";
import logo from "../../icons/SamajLogo.png";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash  } from "react-icons/fa";
import { post } from "../../service/api-service";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ActionTypes } from "../../redux/action-type";

const Login = () => {

  let authUser = useSelector((data) => data.user);

  useEffect(() => {
    if(authUser.user){
      
      if(String(authUser.user.roleName).toLowerCase() === 'admin'){
          navigate('/admin');
      }
      else{
        navigate('/')
      }
    }
  }, [])

  
  const defaultForm = {
    name: "",
    email: "",
    password: "",
  };

  const [passwordEnable, setpasswordEnable] = useState(false);
  const [userList, setuserList] = useState([]);
  const [selectedUser, setselectedUser] = useState(null);
  const [enableSubmit, setenableSubmit] = useState(false);
  const [authForm, setauthForm] = useState(defaultForm);
  const [showPassword, setshowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const emailInputRef = useRef();

  const handleEmailChange = (e) => {
    const email = e.target.value;
    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    setselectedUser(null);
    setuserList([]);
    setpasswordEnable(false);
    setenableSubmit(false);
    setauthForm(defaultForm);
    if (regexEmail.test(email)) {
      const emailForm = {
        email: email,
      };

      setauthForm({
        ...defaultForm,
        email: email,
      });
      //POST Request
      post("/user/getUsersByEmail", emailForm)
        .then((response) => {
          if (response.data.status === 1) {
            console.log(response.data.data);
            setuserList(response.data.data);
          } else {
            console.log("No User Found with this Email Address");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const setCookie = (token) => {
    let expires = "";
    const days = 1;
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = `; expires=${date.toUTCString()}`;

    document.cookie = `${"token"}=Bearer ${token || ""
      }${expires};`

    // console.log("Cookie: ", document.cookie)

    // Check if the connection is secure (HTTPS) before setting the Secure flag
    //const secureFlag = window.location.protocol === "https:" || window.location.protocol === "http:"  ? "; Secure" : "";

    // Set the cookie with HttpOnly and Secure flags
    // document.cookie = `${"token"}=${
    //   token || ""
    // }${expires}; path=/; HttpOnly${secureFlag}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(authForm);
    if (
      authForm.email === "" ||
      authForm.name === "" ||
      authForm.password === ""
    ) {
      console.log("Invalid email, name or password");
    } else {
      post("/auth/auth-member", authForm)
        .then((response) => {
          console.log(response);
          if (response.data.status === 1) {

            const token = response.data.data.accessToken;
            console.log(token);
            setCookie(token);
            dispatch({type: ActionTypes.SET_AUTH_USER, payload: response.data.data.user});            

            if(String(response.data.data.roleName).toLowerCase() !== "admin"){
              navigate("/");
            }
            else{
              navigate("/admin");
            }
          } else {
            console.log(response.data.error.errorMsg);
            setselectedUser(null);
            setuserList([]);
            setauthForm(defaultForm);
            setshowPassword(false);
            emailInputRef.current.value = "";
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  useEffect(() => {
    if (selectedUser != null) {
      setpasswordEnable(true);
      setauthForm({
        ...authForm,
        name: selectedUser,
      });
    } else {
      setpasswordEnable(false);
      setenableSubmit(false);
      setauthForm(defaultForm);
    }
  }, [selectedUser]);

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-card d-flex flex-column align-items-center justify-content-center">
          <div className="logo my-auto">
            <img src={logo} alt="logo" />
          </div>

          <form className="login-first-form" onSubmit={handleSubmit}>
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
                  onChange={handleEmailChange}
                  ref={emailInputRef}
                />
              </div>

              {userList && userList.length > 0 ? (
                <div className="mt-4 username-list">
                  <span className="fs-3 text-capitalize">
                    User Profiles associated with Email:
                  </span>
                  {userList.map((user, index) => (
                    <div
                      key={index}
                      className={`fs-3 mt-1 username ${selectedUser === user.name ? "active" : ""
                        }`}
                      onClick={() => {
                        setselectedUser(user.name);
                      }}
                    >
                      {user.name}
                    </div>
                  ))}
                </div>
              ) : null}

              {passwordEnable ? (
                <div className="mt-4">
                  <label htmlFor="password" className="form-label fs-3">
                    Password
                  </label>
                  <i className="text-danger fs-3">*</i>
                  <div className="password-container">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required={true}
                      placeholder="Enter Your Password"
                      className="form-control fs-3 fw-light mt-1"
                      name="password"
                      value={authForm.password}
                      onChange={(e) => {
                        setauthForm({
                          ...authForm,
                          password: e.target.value,
                        });
                        if (e.target.value !== "") {
                          setenableSubmit(true);
                        } else {
                          setenableSubmit(false);
                        }
                      }}
                    />
                    <button type="button" onClick={()=>setshowPassword(!showPassword)}>
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                    </button>
                  </div>
                </div>
              ) : null}

              <button
                type="submit"
                className="btn btn-submit px-4 py-2 my-5 w-100 fs-3 fw-normal rounded"
                disabled={!enableSubmit}
              >
                Login
              </button>
            </div>
          </form>
          <div className="oval-container">
            <div className="oval">
              <span className="separator-text">
                <div className="or">OR</div>
              </span>
            </div>
          </div>

          <div className="google-sign-in text-center mt-2">
            <span className="fs-4 fw-light">Sign In with</span>
            <button className="border p-3 mx-3 ">
              <FcGoogle size={"2rem"} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
