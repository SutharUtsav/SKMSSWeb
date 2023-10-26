import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./User.css";
import { add, edit, get, getByQueryParams } from "../../../service/api-service";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import FamilyLookUpModal from "../family/FamilyLookUpModal";
import UserLookUpModal from "./UserLookUpModal";
import { useDispatch, useSelector } from "react-redux";
import { ActionTypes } from "../../../redux/action-type";

const UserForm = (props) => {
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
  const [inputMainFamilyMemberRelation, setinputMainFamilyMemberRelation] =
    useState(false);
  const [selectedFamily, setselectedFamily] = useState(null);
  const [selectedFather, setselectedFather] = useState(null);
  const [selectedMother, setselectedMother] = useState(null);

  const [modalForFather, setmodalForFather] = useState(false);
  const [modalForMother, setmodalForMother] = useState(false);

  const roleRef = useRef(null);
  const params = useParams();
  const userId = params.id;
  const navigate = useNavigate();

  //Api call on page load to get all entities look up list
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

  //get Users profile details if user is updating
  useEffect(() => {
    if (userId) {
      get(`/user/${userId}`)
        .then((response) => {
          if (response.data.status === 1) {
            //get role detail
            const roleId = response.data.data.roleId;
            get(`/role/look-up/${roleId}`)
              .then((response) => {
                if (response.data.status === 1) {
                  setUserForm({
                    ...userForm,
                    roleName: response.data.data.name,
                    roleDescription: response.data.data.description,
                    roleType: response.data.data.roleType,
                  });
                  roleRef.current.value = JSON.stringify(response.data.data);

                  getByQueryParams("/user-profile", queryParams)
                    .then((response) => {
                      if (response.data.status === 1) {
                        let user = response.data.data;

                        get(`/family/look-up/${user.familyId}`)
                          .then((response) => {
                            if (response.data.status === 1) {
                              const family = response.data.data;

                              setselectedFamily(family);
                              let fatherDetails = null;
                              let motherDetails = null;
                              let mainFamilyMemberDetails = null;
                              console.log(user);
                              if (user.fatherId) {
                                get(`/user-profile/look-up/${user.fatherId}`)
                                  .then((response) => {
                                    if (response.data.status === 1) {
                                      setselectedFather(response.data.data);
                                      fatherDetails = response.data.data;
                                      console.log(
                                        "fatherdetails",
                                        fatherDetails
                                      );
                                    } else {
                                      console.log(response.data);
                                    }
                                  })
                                  .catch((error) => {
                                    console.log(error);
                                  });
                              }

                              if (user.motherId) {
                                get(`/user-profile/look-up/${user.motherId}`)
                                  .then((response) => {
                                    if (response.data.status === 1) {
                                      setselectedMother(response.data.data);
                                      motherDetails = response.data.data;
                                      console.log(motherDetails);
                                    } else {
                                      console.log(response.data);
                                    }
                                  })
                                  .catch((error) => {
                                    console.log(error);
                                  });
                              }

                              if (user.mainFamilyMemberId) {
                                get(
                                  `/user-profile/look-up/${user.mainFamilyMemberId}`
                                )
                                  .then((response) => {
                                    if (response.data.status === 1) {
                                      mainFamilyMemberDetails =
                                        response.data.data;

                                      setUserForm({
                                        ...userForm,
                                        name: user.name,
                                        userType: "ADMINCREATED",
                                        wifeSurname: user.wifeSurname,
                                        marriedStatus: user.marriedStatus,
                                        birthDate: user.birthDate.split("T")[0],
                                        weddingDate:
                                          user.weddingDate.split("T")[0],
                                        education: user.education,
                                        occupation: user.occupation,
                                        mobileNumber: user.mobileNumber,
                                        countryCode: user.countryCode,
                                        email: user.email,
                                        gender: user.gender,
                                        mainFamilyMemberRelation:
                                          user.mainFamilyMemberRelation,
                                        surname: family.surname,
                                        village: family.village,
                                        villageGuj: family.villageGuj,
                                        mainFamilyMemberName:
                                          user.mainFamilyMemberRelation ===
                                          "SELF"
                                            ? user.name
                                            : mainFamilyMemberDetails.name,
                                        mainFamilyMemberSurname:
                                          user.mainFamilyMemberRelation ===
                                          "SELF"
                                            ? user.surname
                                            : mainFamilyMemberDetails.surname,
                                        mainFamilyMemberVillage:
                                          user.mainFamilyMemberRelation ===
                                          "SELF"
                                            ? user.value
                                            : mainFamilyMemberDetails.village,
                                        fatherName: fatherDetails
                                          ? fatherDetails.name
                                          : "",
                                        fatherSurname: fatherDetails
                                          ? fatherDetails.surname
                                          : "",
                                        fatherVillage: fatherDetails
                                          ? fatherDetails.village
                                          : "",
                                        motherName: motherDetails
                                          ? motherDetails.name
                                          : "",
                                        motherSurname: motherDetails
                                          ? motherDetails.surname
                                          : "",
                                        motherVillage: motherDetails
                                          ? motherDetails.village
                                          : "",
                                      });
                                    } else {
                                      console.log(response.data);
                                    }
                                  })
                                  .catch((error) => {
                                    console.log(error);
                                  });
                              }
                            } else {
                              console.log(response);
                            }
                          })
                          .catch((error) => {
                            console.log(error);
                          });
                      } else {
                        console.log(response);
                      }
                    })
                    .catch((error) => {
                      console.log(error);
                    });
                } else {
                  console.log(response);
                }
              })
              .catch((error) => {
                console.log(error);
              });
          }
        })
        .catch((error) => {
          console.log(error);
        });

      const queryParams = {
        userId: userId,
      };
    }
  }, [userId]);

  // selected family
  useEffect(() => {
    //user's family selected
    if (userId) {
      setinputMainFamilyMemberRelation(true);
    } else {
      if (selectedFamily === null) {
        setUserForm({
          ...userForm,
          mainFamilyMemberRelation: "SELF",
        });
        setinputMainFamilyMemberRelation(false);
      } else {
        const mainFamilyMember = userLookUp.find((user) => {
          return user.name === selectedFamily.mainFamilyMemberName;
        });

        if (mainFamilyMember) {
          setinputMainFamilyMemberRelation(true);

          setUserForm({
            ...userForm,
            surname: selectedFamily.surname,
            village: selectedFamily.village,
            villageGuj: selectedFamily.villageGuj,
            mainFamilyMemberName: mainFamilyMember.name,
            mainFamilyMemberSurname: mainFamilyMember.surname,
            mainFamilyMemberVillage: mainFamilyMember.village,
          });
        } else {
          setUserForm({
            ...userForm,
            surname: selectedFamily.surname,
            village: selectedFamily.village,
            villageGuj: selectedFamily.villageGuj,
            mainFamilyMemberVillage: selectedFamily.village,
            mainFamilyMemberSurname: selectedFamily.surname,
            mainFamilyMemberName: userForm.name,
          });
        }
      }
    }
  }, [selectedFamily]);

  //selected Father details
  useEffect(() => {
    if (selectedFather !== null) {
      setUserForm({
        ...userForm,
        fatherName: selectedFather.name,
        fatherSurname: selectedFather.surname,
        fatherVillage: selectedFather.village,
      });
    } else {
      setUserForm({
        ...userForm,
        fatherName: "",
        fatherSurname: "",
        fatherVillage: "",
      });
    }
    setmodalForFather(false);
  }, [selectedFather]);

  //selected Mother details
  useEffect(() => {
    if (selectedMother !== null) {
      setUserForm({
        ...userForm,
        motherName: selectedMother.name,
        motherSurname: selectedMother.surname,
        motherVillage: selectedMother.village,
      });
    } else {
      setUserForm({
        ...userForm,
        motherName: "",
        motherSurname: "",
        motherVillage: "",
      });
    }
    setmodalForMother(false);
  }, [selectedMother]);

  const handleResetForm = () => {
    if (!userId) {
      setUserForm(defaultUserForm);
      setselectedFather(null);
      setselectedFamily(null);
      setselectedMother(null);
      setinputMainFamilyMemberRelation(false);
      roleRef.current.value = "No Role Selected";
    } else {
      navigate("/admin/users");
    }
  };

  const handleChange = (e) => {
    if (
      e.target.name === "name" &&
      userForm.mainFamilyMemberRelation === "SELF"
    ) {
      setUserForm({
        ...userForm,
        [e.target.name]: e.target.value,
        mainFamilyMemberName: e.target.value,
      });
    } else {
      setUserForm({
        ...userForm,
        [e.target.name]: e.target.value,
      });
    }
  };

  //Method to handle form submission
  const handleSubmitForm = (e) => {
    e.preventDefault();

    if (
      !selectedFamily ||
      (userForm.mainFamilyMemberRelation === "SELF" &&
        selectedFamily.mainFamilyMemberName !== userForm.name)
    ) {
      console.log(
        "Please Select Family or Create Main Family Member's Entry First..."
      );
    } else if (userForm.name === "") {
      console.log("Name is required");
    } else if (userForm.mobileNumber === "" || userForm.countryCode === "") {
      console.log("Mobile number is required");
    } else if (roleRef.current.value === "No Role Selected") {
      console.log("No Role Selected");
    } else if (selectedFamily === null) {
      console.log("Family is not Selected");
    } else {
      console.log(userForm);
      if (!userId) {
        add("/user", userForm)
          .then((response) => {
            console.log(response);
            navigate("/admin/users");
          })
          .catch((error) => {
            console.log(error);
          })
          .finally(() => {
            handleResetForm();
          });
      } else {
        edit("/user", userId, userForm)
          .then((response) => {
            console.log(response);
            navigate("/admin/users");
          })
          .catch((error) => {
            console.log(error);
          })
          .finally(() => {
            handleResetForm();
          });
      }
    }
  };

  return (
    <>
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
                <label htmlFor="userInputFamily">User's Family</label>
                <i className="text-danger">*</i>
                <input
                  type="text"
                  data-bs-toggle="modal"
                  className="form-control"
                  data-bs-target="#familyLookUpModal"
                  placeholder="Select Family..."
                  readOnly={true}
                  value={
                    selectedFamily === null
                      ? "Select Family..."
                      : `Surname : ${selectedFamily.surname}, Village :${selectedFamily.village}, MainFamilyMemberName: ${selectedFamily.mainFamilyMemberName}`
                  }
                />
              </div>

              <div className="col-md-6">
                <label htmlFor="userInputMainFamilyMemberRelation">
                  Relation With Main Family Member
                </label>
                <i className="text-danger">*</i>
                <input
                  id="userInputMainFamilyMemberRelation"
                  type="text"
                  placeholder="Enter Main Family Member Details"
                  className="form-control"
                  name="mainFamilyMemberRelation"
                  value={userForm.mainFamilyMemberRelation}
                  onChange={handleChange}
                  disabled={!inputMainFamilyMemberRelation}
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
                  onChange={(e) => {
                    if (e.target.value === "Gender is not Selected") {
                      setUserForm({
                        ...userForm,
                        gender: "",
                      });
                    } else {
                      setUserForm({
                        ...userForm,
                        gender: e.target.value,
                      });
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
                      // defaultChecked = {userForm.roleName === role.name}
                    >
                      Name: {role.name} RoleType : {role.roleType}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label htmlFor="userInputMother">User's Mother</label>
                <input
                  type="text"
                  id="userInputMother"
                  data-bs-toggle="modal"
                  className="form-control"
                  data-bs-target="#userLookUpModal"
                  placeholder="Select Mother..."
                  readOnly={true}
                  value={
                    selectedMother === null
                      ? "Select Mother..."
                      : `Name : ${selectedMother.name}, Surname : ${selectedMother.surname}, Village :${selectedMother.village}`
                  }
                  onClick={() => {
                    setmodalForMother(true);
                  }}
                />
              </div>

              <div className="col-md-6">
                <label htmlFor="userInputFather">User's Father</label>
                <input
                  type="text"
                  id="userInputFather"
                  data-bs-toggle="modal"
                  className="form-control"
                  data-bs-target="#userLookUpModal"
                  placeholder="Select Father..."
                  readOnly={true}
                  value={
                    selectedFather === null
                      ? "Select Father..."
                      : `Name : ${selectedFather.name}, Surname : ${selectedFather.surname}, Village :${selectedFather.village}`
                  }
                  onClick={() => {
                    setmodalForFather(true);
                  }}
                />
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
                  // data-bs-dismiss="modal"
                  onClick={handleResetForm}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <FamilyLookUpModal
        familyLookUp={familyLookUp}
        setselectedFamily={setselectedFamily}
        selectedFamily={selectedFamily}
      />
      <UserLookUpModal
        userLookUp={userLookUp}
        modalForFather={modalForFather}
        setmodalForFather={setmodalForFather}
        setselectedFather={setselectedFather}
        selectedFather={selectedFather}
        modalForMother={modalForMother}
        setmodalForMother={setmodalForMother}
        setselectedMother={setselectedMother}
        selectedMother={selectedMother}
      />
    </>
  );
};

export default UserForm;
