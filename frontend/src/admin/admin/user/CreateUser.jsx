import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./User.css";
import { add, get } from "../../../service/api-service";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

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
    mainFamilyMemberRelation: "SELF",
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
    roleName: "",
    roleDescription: "",
    roleType: "",
  };

  const [userForm, setUserForm] = useState(defaultUserForm);
  const [familyLookUp, setFamilyLookUp] = useState([]);
  const [roleLookUp, setRoleLookUp] = useState([]);
  const [userLookUp, setUserLookUp] = useState([]);
  const [inputMainFamilyMemberRelation, setinputMainFamilyMemberRelation] =useState(false);

  const familyRef = useRef(null);
  const roleRef = useRef(null);
  const mainFamilyMemberRef = useRef(null);
  const motherRef = useRef(null);
  const fatherRef = useRef(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    get("/family/look-up")
      .then((response) => {
        if (response.data.status === 1) {
          setFamilyLookUp(response.data.data);
        } else {
          console.log(response);
        }
      })
      .catch((error) => {
        console.log(error);
      });

    get("/role/look-up")
      .then((response) => {
        if (response.data.status === 1) {
          setRoleLookUp(response.data.data);
        } else {
          console.log(response);
        }
      })
      .catch((error) => {
        console.log(error);
      });

    get("/user-profile/look-up")
      .then((response) => {
        if (response.data.status === 1) {
          setUserLookUp(response.data.data);
        } else {
          console.log(response);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleResetForm = () => {
    setUserForm(defaultUserForm);
    familyRef.current.value = "Family is not Selected"
    roleRef.current.value = "No Role Selected"
    mainFamilyMemberRef.current.value = "Main Family Member"
    motherRef.current.value = "Mother is not Selected"
    familyRef.current.value = "Father is not Selected"
  };

  const handleChange = (e) => {
    setUserForm({
      ...userForm,
      [e.target.name]: e.target.value,
    });
  };

  //Method to handle form submission
  const handleSubmitForm = (e) => {
    e.preventDefault();

    if(mainFamilyMemberRef.current.value === "Main Family Member" || userForm.mainFamilyMemberRelation === "SELF"){
      setUserForm({
        ...userForm,
        mainFamilyMemberRelation : "SELF",
        mainFamilyMemberName : userForm.name
      })
    }

    if(userForm.mobileNumber === "" || userForm.countryCode === ""){
      console.log("Mobile number is required")
    }
    else if(roleRef.current.value === "No Role Selected"){
      console.log("No Role Selected")
    }
    else if(familyRef.current.value === "Family is not Selected"){
      console.log("Family is not Selected")
    }
    else{
      console.log(userForm);
      add('/user',userForm)
      .then((response)=>{
        console.log(response);
      })
      .catch((error)=>{ 
        console.log(error)
      })
    }
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

          <form className="row mt-5 gx-5 gy-5" onSubmit={handleSubmitForm}>
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
                value={userForm.name}
                onChange={handleChange}
                required={true}
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
                required={true}
                onChange={handleChange}
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
              <label htmlFor="userInputEmail">User Gender</label>
              <select
                id="userInputGender"
                type="email"
                placeholder="Enter User Email"
                className="form-control fs-2 fw-light"
                name="email"
                value={userForm.gender}
                onChange={(e)=>{
                  if(e.target.value === "Gender is not Selected"){
                    setUserForm({
                      ...userForm,
                      gender : ""
                    })
                  }
                  else{
                    setUserForm({
                      ...userForm,
                      gender : e.target.value
                    })
                  }
                }}
              >
                <option
                  defaultChecked={true}
                  value={"Gender is not Selected"}
                  className="fs-2 fw-light"
                >
                  Select Gender...
                </option>
                <option
                  defaultChecked={true}
                  value="MALE"
                  className="fs-2 fw-light"
                >
                  Male
                </option>
                <option
                  defaultChecked={true}
                  value="FEMALE"
                  className="fs-2 fw-light"
                >
                  Female
                </option>
              </select>
            </div>

            <div className="col-md-6">
              <label htmlFor="userInputCountryCode">Mobile Number</label>
              <i className="text-danger">*</i>
              <div className="d-flex gap-3">
                <PhoneInput
                  country={"in"}
                  value={userForm.mobileNumber}
                  required={true}
                  onChange={(phone, country) => {
                    setUserForm({
                      ...userForm,
                      mobileNumber: phone,
                      countryCode: country.dialCode,
                    });
                  }}
                />
              </div>
            </div>

            <div className="col-md-6">
              <label htmlFor="userInputEmail">User Email</label>
              <input
                id="userInputEmail"
                type="email"
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
              <select
                className="form-select fs-2 fw-light"
                id="userInputFamily"
                ref={familyRef}
                onChange={(e) => {
                  console.log(e.target.value);
                  if (e.target.value === "Family is not Selected") {
                    setUserForm({
                      ...userForm,
                      surname: "",
                      village: "",
                      villageGuj: "",
                    });
                  } else {
                    const family = JSON.parse(e.target.value);
                    console.log(family);
                    setUserForm({
                      ...userForm,
                      surname: family.surname,
                      village: family.village,
                      villageGuj: family.villageGuj,
                    });
                  }
                }}
              >
                <option
                  defaultChecked={true}
                  value={"Family is not Selected"}
                  className="fs-2 fw-light"
                >
                  Select Family...
                </option>
                {familyLookUp?.map((family, index) => (
                  <option
                    key={index}
                    value={JSON.stringify(family)}
                    className="fs-2 fw-light"
                  >
                    Surname: {family.surname} Village: {family.village} Main
                    Family Member Name: {family.mainFamilyMemberName}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label htmlFor="userInputMainFamilyMember">
                Family's Main Family Member Name
              </label>
              <i className="text-danger">*</i>
              <select
                className="form-select fs-2 fw-light"
                id="userInputMainFamilyMember"
                ref={mainFamilyMemberRef}
                onChange={(e) => {
                  console.log(e.target.value);
                  const user = JSON.parse(e.target.value);
                  console.log(user);
                  if (e.target.value === "Main Family Member") {
                    setUserForm({
                      ...userForm,
                      mainFamilyMemberName: user.name,
                      mainFamilyMemberRelation: "SELF",
                      mainFamilyMemberSurname: user.surname,
                      mainFamilyMemberVillage: user.village,
                    });
                    setinputMainFamilyMemberRelation(false);
                  } else {
                    setUserForm({
                      ...userForm,
                      mainFamilyMemberName: user.name,
                      mainFamilyMemberSurname: user.surname,
                      mainFamilyMemberVillage: user.village,
                    });

                    setinputMainFamilyMemberRelation(true);
                  }
                }}
              >
                <option
                  defaultChecked={true}
                  value={"Main Family Member"}
                  className="fs-2 fw-light"
                >
                  User is Main Family Member
                </option>
                {userLookUp?.map((user, index) => (
                  <option
                    key={index}
                    value={JSON.stringify(user)}
                    className="fs-2 fw-light"
                  >
                    Name: {user.name} Surname : {user.surname} Village :
                    {user.village}
                    {user.village}
                  </option>
                ))}
              </select>
            </div>

            {inputMainFamilyMemberRelation ? (
              <div className="col-md-6">
                <label htmlFor="userInputMainFamilyMemberRelation">
                  Relation With Main Family Member
                </label>
                <input
                  id="userInputMainFamilyMemberRelation"
                  type="text"
                  placeholder="Enter User Email"
                  className="form-control"
                  name="mainFamilyMemberRelation"
                  value={userForm.mainFamilyMemberRelation}
                  onChange={handleChange}
                />
              </div>
            ) : null}

            <div className="col-md-6">
              <label htmlFor="userInputRole">User's Role</label>
              <i className="text-danger">*</i>
              <select
                className="form-select fs-2 fw-light"
                id="userInputRole"
                ref={roleRef}
                onChange={(e) => {
                  if (e.target.value === "No Role Selected") {
                    setUserForm({
                      ...userForm,
                      roleName: "",
                      roleDescription: "",
                      roleType: "",
                    });
                  } else {
                    const role = JSON.parse(e.target.value);

                    setUserForm({
                      ...userForm,
                      roleName: role.name,
                      roleDescription: role.description,
                      roleType: role.roleType,
                    });
                  }
                }}
              >
                <option
                  defaultChecked={true}
                  value="No Role Selected"
                  className="fs-2 fw-light"
                >
                  Select Role...
                </option>
                {roleLookUp?.map((role, index) => (
                  <option
                    key={index}
                    value={JSON.stringify(role)}
                    className="fs-2 fw-light"
                  >
                    Name: {role.name} RoleType : {role.roleType}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label htmlFor="userInputMother">User's Mother</label>
              <select
                className="form-select fs-2 fw-light"
                id="userInputMother"
                ref={motherRef}
                onChange={(e) => {
                  console.log(e.target.value);
                  if (e.target.value === "Mother is not Selected") {
                    setUserForm({
                      ...userForm,
                      motherName: "",
                      motherSurname: "",
                      motherVillage: "",
                    });
                  } else {
                    const user = JSON.parse(e.target.value);
                    setUserForm({
                      ...userForm,
                      motherName: user.name,
                      motherSurname: user.surname,
                      motherVillage: user.village,
                    });
                  }
                }}
              >
                <option
                  defaultChecked={true}
                  className="fs-2 fw-light"
                  value={"Mother is not Selected"}
                >
                  Select User...
                </option>
                {userLookUp?.map((user, index) => (
                  <option
                    key={index}
                    value={JSON.stringify(user)}
                    className="fs-2 fw-light"
                  >
                    Name: {user.name} Surname : {user.surname} Village :{" "}
                    {user.village}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label htmlFor="userInputFather">User's Father</label>
              <select
                className="form-select fs-2 fw-light"
                id="userInputFather"
                ref={fatherRef}
                onChange={(e) => {
                  console.log(e.target.value);
                  if (e.target.value === "Father is not Selected") {
                    setUserForm({
                      ...userForm,
                      fatherName: "",
                      fatherSurname: "",
                      fatherVillage: "",
                    });
                  } else {
                    const user = JSON.parse(e.target.value);
                    setUserForm({
                      ...userForm,
                      fatherName: user.name,
                      fatherSurname: user.surname,
                      fatherVillage: user.village,
                    });
                  }
                }}
              >
                <option
                  defaultChecked={true}
                  value={"Father is not Selected"}
                  className="fs-2 fw-light"
                >
                  Select User...
                </option>
                {userLookUp?.map((user, index) => (
                  <option
                    key={index}
                    value={JSON.stringify(user)}
                    className="fs-2 fw-light"
                  >
                    Name: {user.name} Surname : {user.surname} Village :{" "}
                    {user.village}
                  </option>
                ))}
              </select>
            </div>

            <div className="float-end mt-4">
              <button
                type="submit"
                className="btn btn-save m-2 px-4 py-2 fs-3 fw-normal rounded"
              >
                Save
              </button>
              <button
                type="button"
                className="btn btn-secondary m-2 px-4 py-2 fs-3 fw-normal rounded"
                data-bs-dismiss="modal"
                onClick={handleResetForm}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateUser;
