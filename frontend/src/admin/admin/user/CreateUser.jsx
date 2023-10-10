import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./User.css";
import useApiCall from "../../../hooks/useApiCall";
import { get } from "../../../service/api-service";

const CreateUser = () => {
  const defaultUserForm = {
    name: "",
    userType: "ADMINCREATED",
    wifeSurname: "",
    marriedStatus: "",
    birthDate: null,
    weddingDate: null,
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

  let { data, setData, error, setError, loading, setLoading } = useApiCall(() =>
    get("/family/look-up")
  );

  const [userForm, setuserForm] = useState(defaultUserForm);

  const navigate = useNavigate();

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
              {" "}
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
                value={userForm.userType}
                disabled={true}
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="userInputMarriedStatus">
                User Married Status
              </label>
              <i className="text-danger">*</i>
              <input
                id="userInputMarriedStatus"
                type="text"
                placeholder="Enter User Married Status"
                className="form-control"
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="userInputWifeSurname">User Wife Surname</label>
              <input
                id="userInputWifeSurname"
                type="text"
                placeholder="Enter User Wife Surname"
                className="form-control"
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="userInputBirthdate">User BirthDate</label>
              <input
                id="userInputBirthdate"
                type="date"
                placeholder="Enter User Birthdate"
                className="form-control"
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="userInputWeddingdate">User Wedding Date</label>
              <input
                id="userInputWeddingdate"
                type="date"
                placeholder="Enter User Wedding Date"
                className="form-control"
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="userInputEducation">User Education</label>
              <input
                id="userInputEducation"
                type="text"
                placeholder="Enter User Education"
                className="form-control"
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="userInputOccupation">User Occupation</label>
              <input
                id="userInputOccupation"
                type="text"
                placeholder="Enter User Occupation"
                className="form-control"
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="userInputCountryCode">Mobile Number</label>
              <i className="text-danger">*</i>
              <div className="d-flex gap-3">
                <input
                  id="userInputCountryCode"
                  type="text"
                  placeholder="Enter Country Code"
                  className="form-control"
                />
                <input
                  id="userInputMobileNumber"
                  type="text"
                  placeholder="Enter Mobile Number"
                  className="form-control"
                />
              </div>
            </div>

            <div className="col-md-6">
              <label htmlFor="userInputEmail">User Email</label>
              <input
                id="userInputEmail"
                type="text"
                placeholder="Enter User Email"
                className="form-control"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateUser;
