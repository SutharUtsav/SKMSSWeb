import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getByQueryParams } from "../../../service/api-service";
import UserImage from "../../../images/profile.jpg";
import { BiEditAlt } from "react-icons/bi";
import UserProfileImageModal from "./UserProfileImageModal";

const UserDetails = () => {
  const params = useParams();
  const userId = params.id;

  const [userProfileImage, setuserProfileImage] = useState(null);
  const [userProfile, setuserProfile] = useState(null);

  useEffect(() => {
    if (userId) {
      const queryJson = {
        userId: userId,
      };
      getByQueryParams("/user-profile/profile-image", queryJson)
        .then((response) => {
          if (response.status === 1) {
            setuserProfileImage(response.data.data);
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
          }
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [userId]);

  return (
    <div className="user-details p-5 m-4 d-flex flex-column justify-content-center align-items-center">
      <div className="user-image shadow">
        <img src={UserImage} alt="user-profile" />
        <button title="Upload Image" className="edit-btn" data-bs-toggle="modal" data-bs-target="#uploadProfileImageModal">
          <BiEditAlt size={"15px"} fill="#fff"  />
        </button>
      </div>

      <UserProfileImageModal userId={userId}/>

      {userProfile ? (
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
      ) : (
        <div>
          <p>No Data Found</p>
        </div>
      )}
    </div>
  );
};

export default UserDetails;
