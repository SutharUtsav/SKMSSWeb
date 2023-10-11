import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./User.css";
import { get } from "../../../service/api-service";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

const CreateUser = () => {
  const defaultUserForm = {
    name: "",
    userType: "ADMINCREATED",
    wifeSurname: "",
    marriedStatus: "",
    birthDate: "",
    weddingDate: "",
    education: "",
    occupation: "",
    mobileNumber: "",
    countryCode: "",
    email: "",
    gender: "",
    mainFamilyMemberName: "",
    mainFamilyMemberRelation: "",
    mainFamilyMemberSurname: "",
    mainFamilyMemberVillage: "",
    fatherName: "",
    fatherSurname: "",
    fatherVillage: "",
    motherName: "",
    motherSurname: "",
    motherVillage: "",
    surname: "",
    village: "",
    villageGuj: "",
    currResidency: "",
    adobeOfGod: "",
    goddess: "",
    lineage: "",
    residencyAddress: "",
  };


  const [userForm, setuserForm] = useState(defaultUserForm);
  const [familyLookUp, setFamilyLookUp] = useState([]);
  const [roleLookUp, setRoleLookUp] = useState([]);
  const [userLookUp, setUserLookUp] = useState([]);
  const [userFrom, setUserForm] = useState(defaultUserForm);

  const navigate = useNavigate();

  useEffect(() => {
    get("/family/look-up")
      .then((response) => {
        if (response.data.status === 1) {
          setFamilyLookUp(response.data.data)
        }
        else {
          console.log(response)
        }
      })
      .catch((error) => {
        console.log(error)
      })

    get("/role/look-up")
      .then((response) => {
        if (response.data.status === 1) {
          setRoleLookUp(response.data.data)
        }
        else {
          console.log(response)
        }
      })
      .catch((error) => {
        console.log(error)
      })

    get("/user-profile/look-up")
      .then((response) => {
        if (response.data.status === 1) {
          setUserLookUp(response.data.data)
        }
        else {
          console.log(response)
        }
      })
      .catch((error) => {
        console.log(error)
      })

  }, [])

  const handleResetForm = () => {
    setUserForm(defaultUserForm);
  };

  const handleChange = (e) => {
    setUserForm({
      ...userForm,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="users content">
      <div className="content-header d-flex flex-row justify-content-between align-items-center">
        <h3 className="fs-1">Create User</h3>

        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item fs-3">
              <Link to="/admin">Dashboard</Link>
            </li>
            <li className="breadcrumb-item fs-3">
              <Link to="/admin/users">Users</Link>
            </li>
            <li className="breadcrumb-item active fs-3  " aria-current="page">
              Create User
            </li>
          </ol>
        </nav>
      </div>

      <div className="card content-main">
        <div className="card-header content-title">
          <h4>New User</h4>
          <span className="pull-right">
            <button
              onClick={() => {
                navigate("/admin/users");
              }}
            >
              Manage Users
            </button>
          </span>
        </div>

        <div className="card-body content-body create-form-page">
          <label className="fs-2 fw-normal">
            <span className=" text-danger me-2 fs-2">*</span>
            Required Fields
          </label>

          <form className="row mt-5 gx-5 gy-5">
            <h3 className="text-uppercase my-1 mx-0 text-center">
              User Details
            </h3>

            <div className="col-md-6">
              <label htmlFor="userInputName">User Name</label>
              <i className="text-danger">*</i>
              <input
                id="userInputName"
                type="text"
                placeholder="Enter User Fullname"
                className="form-control"
                name="name"
                value={userFrom.name}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="userInputType">User Type</label>
              <i className="text-danger">*</i>
              <input
                id="userInputType"
                type="text"
                placeholder="Enter User Type"
                className="form-control"
                name="userType"
                value={userForm.userType}
                disabled={true}
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="userInputMarriedStatus">
                User Married Status
              </label>
              <input
                id="userInputMarriedStatus"
                type="text"
                placeholder="Enter User Married Status"
                className="form-control"
                name="marriedStatus"
                value={userForm.marriedStatus}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="userInputWifeSurname">User Wife Surname</label>
              <input
                id="userInputWifeSurname"
                type="text"
                placeholder="Enter User Wife Surname"
                className="form-control"
                name="wifeSurname"
                value={userForm.wifeSurname}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="userInputBirthdate">User BirthDate</label>
              <input
                id="userInputBirthdate"
                type="date"
                placeholder="Enter User Birthdate"
                className="form-control"
                name="birthDate"
                value={userForm.birthDate}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="userInputWeddingdate">User Wedding Date</label>
              <input
                id="userInputWeddingdate"
                type="date"
                placeholder="Enter User Wedding Date"
                className="form-control"
                name="weddingDate"
                value={userForm.weddingDate}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="userInputEducation">User Education</label>
              <input
                id="userInputEducation"
                type="text"
                placeholder="Enter User Education"
                className="form-control"
                name="education"
                value={userForm.education}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="userInputOccupation">User Occupation</label>
              <input
                id="userInputOccupation"
                type="text"
                placeholder="Enter User Occupation"
                className="form-control"
                name="occupation"
                value={userForm.occupation}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="userInputCountryCode">Mobile Number</label>
              <i className="text-danger">*</i>
              <div className="d-flex gap-3">
                <PhoneInput country={'in'}
                  value={defaultUserForm.mobileNumber}
                  onChange={(phone) => {
                    console.log(phone)
                  }} />
              </div>
            </div>

            <div className="col-md-6">
              <label htmlFor="userInputEmail">User Email</label>
              <input
                id="userInputEmail"
                type="text"
                placeholder="Enter User Email"
                className="form-control"
                name="email"
                value={userForm.email}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="userInputFamily">User's Family</label>
              <i className="text-danger">*</i>
              <select className="form-select fs-2 fw-light" id="userInputFamily" >
                <option defaultChecked={true} value={0} className="fs-2 fw-light">Select Family...</option>
                {familyLookUp && familyLookUp.map((family, index) => (
                  <option key={index} value={family} className="fs-2 fw-light">
                    Surname: {family.surname}  Village: {family.village} Main Family Member Name: {family.mainFamilyMemberName}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label htmlFor="userInputFamily">Family's Main Family Member Name</label>
              <i className="text-danger">*</i>
              <select className="form-select fs-2 fw-light" id="userInputFamily" >
                <option defaultChecked={true} value={0} className="fs-2 fw-light">Select Main Family Member Name...</option>
                {userLookUp && userLookUp.map((user, index) => (
                  <option key={index} value={user} className="fs-2 fw-light">
                    Name: {user.name} Surname : {user.surname} Village : {user.village}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label htmlFor="userInputFamily">User's Role</label>
              <i className="text-danger">*</i>
              <select className="form-select fs-2 fw-light" id="userInputFamily" >
                <option defaultChecked={true} value={0} className="fs-2 fw-light">Select Role...</option>
                {roleLookUp && roleLookUp.map((role, index) => (
                  <option key={index} value={role} data-subtext={role.roleType} className="fs-2 fw-light">
                    Name: {role.name} RoleType : {role.roleType}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label htmlFor="userInputFamily">User's Mother</label>
              <i className="text-danger">*</i>
              <select className="form-select fs-2 fw-light" id="userInputFamily" >
                <option defaultChecked={true} value={0} className="fs-2 fw-light">Select User...</option>
                {userLookUp && userLookUp.map((user, index) => (
                  <option key={index} value={user} className="fs-2 fw-light">
                    Name: {user.name} Surname : {user.surname} Village : {user.village}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label htmlFor="userInputFamily">User's Father</label>
              <i className="text-danger">*</i>
              <select className="form-select fs-2 fw-light" id="userInputFamily" >
                <option defaultChecked={true} value={0} className="fs-2 fw-light">Select User...</option>
                {userLookUp && userLookUp.map((user, index) => (
                  <option key={index} value={user} className="fs-2 fw-light">
                    Name: {user.name} Surname : {user.surname} Village : {user.village}
                  </option>
                ))}
              </select>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateUser;
