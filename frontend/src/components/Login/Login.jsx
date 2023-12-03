import React, { useState, useEffect } from "react";
import "./Login.css";
import logo from "../../icons/SamajLogo.png";
import { FcGoogle } from "react-icons/fc";
import { post } from "../../service/api-service";
import { setMaxListeners } from "form-data";

const Login = () => {

  const defaultForm = {
    name: '',
    email: '',
    password: ''
  }

  const [passwordEnable, setpasswordEnable] = useState(false)
  const [userList, setuserList] = useState([])
  const [selectedUser, setselectedUser] = useState(null)
  const [enableSubmit, setenableSubmit] = useState(false)
  const [authForm, setauthForm] = useState(defaultForm)

  const handleEmailChange = (e) => {
    const email = e.target.value;
    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;   

    setselectedUser(null)
    setuserList([])
    setpasswordEnable(false)
    setenableSubmit(false)
    setauthForm(defaultForm)
    if(regexEmail.test(email)){
      const emailForm = {
        email : email
      }

      setauthForm({
        ...defaultForm,
        email: email
      })
      //POST Request
      post("/user/getUsersByEmail", emailForm)
          .then((response) => {
            if(response.data.status === 1){
              console.log(response.data.data)
              setuserList(response.data.data)
            }  
            else{
              console.log("No User Found with this Email Address")
            }
          })
          .catch((error) => {
            console.log(error);
          })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(authForm)
    if(authForm.email === "" || authForm.name === "" || authForm.password === ""){
      console.log("Invalid email, name or password");
    }
    else{
      post('/auth/auth-member', authForm)
      .then((response) => {
        console.log(response)
        if(response.data.status === 1){
          
        }  
        else{
          selectedUser(null)
          setuserList([])
        }
      })
      .catch((error) => {
        console.log(error);
      })
    }
  }

  useEffect(() => {
    if(selectedUser!=null){
      setpasswordEnable(true)
      setauthForm({
        ...authForm,
        name:selectedUser
      })
    }
    else{
      setpasswordEnable(false)
      setenableSubmit(false)
      setauthForm(defaultForm)
    }
  }, [selectedUser])


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
                />
              </div>

              {userList && userList.length > 0 ?  (
                <div className="mt-4 username-list">
                  <span className="fs-3 text-capitalize">User Profiles associated with Email:</span>
                  {userList.map((user,index)=>(
                    <div key={index} className={`fs-3 mt-1 username ${selectedUser=== user.name ? 'active' : ''}`} onClick={()=>{
                      setselectedUser(user.name)
                    }}>
                      {user.name}
                    </div>
                  ))}
                </div>
              ): null}

              {passwordEnable ? (
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
                  onChange={(e)=>{
                    setauthForm({
                      ...authForm,
                      password:e.target.value
                    })
                    if(e.target.value!==""){
                      setenableSubmit(true)
                    }
                    else{
                      setenableSubmit(false)
                    }
                  }}
                />
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
