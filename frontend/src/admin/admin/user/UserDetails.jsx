import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getByQueryParams, post } from "../../../service/api-service";
import UserImage from "../../../images/profile.jpg";
import { BiEditAlt } from "react-icons/bi";
import UserProfileImageModal from "./UserProfileImageModal";

const UserDetails = () => {

  const defaultSocialWorkerForm = {
    name: "",
    surname: "",
    village: "",
    position: ""
  }

  const params = useParams();
  const userId = params.id;

  const [userProfileImage, setuserProfileImage] = useState(null);
  const [userProfile, setuserProfile] = useState(null);
  const [isReloadProfileImage, setisReloadProfileImage] = useState(false)
  const [socialWorkerForm, setsocialWorkerForm] = useState(defaultSocialWorkerForm);

  useEffect(() => {
    if (userId) {
      const queryJson = {
        userId: userId,
      };
      getByQueryParams("/user-profile/profile-image", queryJson)
        .then((response) => {
          if (response.data.status === 1) {
            setuserProfileImage(response.data.data.image);
          }
          else {
            setuserProfileImage(null);
          }
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });

      getByQueryParams("/user-profile", queryJson)
        .then((response) => {
          if (response.data.status === 1) {
            setuserProfile(response.data.data);
            let userProfile = response.data.data;
            setsocialWorkerForm({
              ...socialWorkerForm,
              name: userProfile.name,
              surname: userProfile.surname,
              village: userProfile.village
            });
          }
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [userId]);

  useEffect(() => {
    if (isReloadProfileImage && userId) {
      const queryJson = {
        userId: userId,
      };
      getByQueryParams("/user-profile/profile-image", queryJson)
        .then((response) => {
          if (response.data.status === 1) {
            setuserProfileImage(response.data.data.image);
            setisReloadProfileImage(false)
          }
          else {
            setuserProfileImage(null)
          }
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        })
    }

  }, [isReloadProfileImage])


  const handleChange = (e) => {
    setsocialWorkerForm({
      ...socialWorkerForm,
      [e.target.name]: e.target.value,
    });
  };

  const assignSocialWorkingPost = (e) => {
    e.preventDefault();

    if (socialWorkerForm.name?.length <= 0 || socialWorkerForm.surname?.length <=0 || socialWorkerForm.village?.length <=0) {
      console.log("Invalid User Details");
    }
    else if (!socialWorkerForm.position) {
      console.log("Please select social working position");
    }
    else {
      post('/social-worker',socialWorkerForm)
      .then((response)=> {
        
        console.log(response.data)
        if(response.data.status === 1){
          console.log("Succssfully assigned social position to user")
        }
      })
      .catch((error)=>{
        console.log(error);
      })
    }
  }

  return (
    <div className="user-details p-5 m-4 d-flex flex-column justify-content-center align-items-center">
      <div className="user-image shadow">
        {userProfileImage
          ? <img src={userProfileImage} alt="user-profile" />
          : <img src={UserImage} alt="user-profile" />
        }
        <button title="Upload Image" className="edit-btn" data-bs-toggle="modal" data-bs-target="#uploadProfileImageModal">
          <BiEditAlt size={"15px"} fill="#fff" />
        </button>
      </div>

      <UserProfileImageModal userId={userId} setisReloadProfileImage={setisReloadProfileImage} />

      {userProfile ? (
        <>
          <div className="user-detail-wrapper">
            <h3 className="text-uppercase my-1 fs-1 mx-0 text-center">
              User Details
            </h3>

            <div className="row">
              <div className="col-md-6 mt-5">
                <label htmlFor="userDetailsInputName" className="fs-2">
                  User Name:
                </label>
                <p id="userDetailsInputName" className="fs-2 fw-light">
                  {userProfile.name}
                </p>
              </div>

              <div className="col-md-6 mt-5">
                <label htmlFor="userDetailsInputSurname" className="fs-2">
                  User Surname:
                </label>
                <p id="userDetailsInputSurname" className="fs-2 fw-light">
                  {userProfile.surname}
                </p>
              </div>

              <div className="col-md-6 mt-5">
                <label htmlFor="userDetailsInputVillage" className="fs-2">
                  User Vilage:
                </label>
                <p id="userDetailsInputVillage" className="fs-2 fw-light">
                  {userProfile.village}
                </p>
              </div>

              <div className="col-md-6 mt-5">
                <label htmlFor="userDetailsInputBirthDate" className="fs-2">
                  User BirthDate:
                </label>
                <p id="userDetailsInputBirthDate" className="fs-2 fw-light">
                  {userProfile.birthDate
                    ? new Date(userProfile.birthDate).toDateString()
                    : "-"}
                </p>
              </div>

              <div className="col-md-6 mt-5">
                <label htmlFor="userDetailsInputGender" className="fs-2">
                  User Gender:
                </label>
                <p id="userDetailsInputGender" className="fs-2 fw-light">
                  {userProfile.gender ? userProfile.gender : "-"}
                </p>
              </div>

              <div className="col-md-6 mt-5">
                <label htmlFor="userDetailsInputEducation" className="fs-2">
                  User Education:
                </label>
                <p id="userDetailsInputEducation" className="fs-2 fw-light">
                  {userProfile.education ? userProfile.education : "-"}
                </p>
              </div>

              <div className="col-md-6 mt-5">
                <label htmlFor="userDetailsInputOccupation" className="fs-2">
                  User Occupation:
                </label>
                <p id="userDetailsInputOccupation" className="fs-2 fw-light">
                  {userProfile.occupation ? userProfile.occupation : "-"}
                </p>
              </div>

              <div className="col-md-6 mt-5">
                <label htmlFor="userDetailsInputEmail" className="fs-2">
                  User Email:
                </label>
                <p id="userDetailsInputEmail" className="fs-2 fw-light">
                  {userProfile.email ? userProfile.email : "-"}
                </p>
              </div>

              <div className="col-md-6 mt-5">
                <label htmlFor="userDetailsInputCountryCode" className="fs-2">
                  User Country Code:
                </label>
                <p id="userDetailsInputCountryCode" className="fs-2 fw-light">
                  {userProfile.countryCode ? userProfile.countryCode : "-"}
                </p>
              </div>

              <div className="col-md-6 mt-5">
                <label htmlFor="userDetailsInputMobileNumber" className="fs-2">
                  User Mobile Number:
                </label>
                <p id="userDetailsInputMobileNumber" className="fs-2 fw-light">
                  {userProfile.mobileNumber ? userProfile.mobileNumber : "-"}
                </p>
              </div>

              <div className="col-md-6 mt-5">
                <label htmlFor="userDetailsInputMarriedStatus" className="fs-2">
                  User Married Status:
                </label>
                <p id="userDetailsInputMarriedStatus" className="fs-2 fw-light">
                  {userProfile.marriedStatus}
                </p>
              </div>

              {userProfile.marriedStatus === "Married" ? (
                <>
                  <div className="col-md-6 mt-5">
                    <label htmlFor="userDetailsInputMarriedDate" className="fs-2">
                      User Wedding Date:
                    </label>
                    <p id="userDetailsInputMarriedDate" className="fs-2 fw-light">
                      {userProfile.weddingDate
                        ? new Date(userProfile.weddingDate).toDateString()
                        : "-"}
                    </p>
                  </div>

                  {userProfile.gender === "MALE" ? (
                    <div className="col-md-6 mt-5">
                      <label
                        htmlFor="userDetailsInputWifeSurname"
                        className="fs-2"
                      >
                        User Wife Surname:
                      </label>
                      <p
                        id="userDetailsInputWifeSurname"
                        className="fs-2 fw-light"
                      >
                        {userProfile.wifeSurname ? userProfile.wifeSurname : "-"}
                      </p>
                    </div>
                  ) : null}
                </>
              ) : null}

              <div className="col-md-6 mt-5">
                <label htmlFor="userDetailsInputFatherName" className="fs-2">
                  User Father Name:
                </label>
                <p id="userDetailsInputFatherName" className="fs-2 fw-light">
                  {userProfile.fatherName ? userProfile.fatherName : "-"}
                </p>
              </div>

              <div className="col-md-6 mt-5">
                <label htmlFor="userDetailsInputMotherName" className="fs-2">
                  User Mother Name:
                </label>
                <p id="userDetailsInputMotherName" className="fs-2 fw-light">
                  {userProfile.motherName ? userProfile.motherName : "-"}
                </p>
              </div>
            </div>
          </div>

          <div className="content w-100">
            <div className="card content-main">
              <form className="content-body card-body" onSubmit={assignSocialWorkingPost}>
                <h3 className="text-uppercase my-1 fs-1 mx-0 text-center">
                  Assign Social Working Post
                </h3>

                <div className="mt-5 col-md-6">
                  <label htmlFor="socialWorkingPostInput" className="fs-2">
                    Social Working Post
                  </label>
                  <input type="text" className="form-control"
                    name="position"
                    id="socialWorkingPostInput" placeholder="Enter Social Working Post"
                    value={socialWorkerForm.position}
                    onChange={handleChange}></input>
                </div>

                <div className="float-start mt-4">
                  <button
                    type="submit"
                    className="btn btn-save m-2 px-4 py-2 fs-3 fw-normal rounded"
                  >
                    Assign Social Role
                  </button>
                </div>

              </form>
            </div>
          </div>
        </>

      ) : (
        <div>
          <p>No Data Found</p>
        </div>
      )}
    </div>
  );
};

export default UserDetails;
