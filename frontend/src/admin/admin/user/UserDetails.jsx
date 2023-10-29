import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { getByQueryParams } from "../../../service/api-service";
import UserImage from '../../../images/profile.jpg';
import { BiEditAlt } from 'react-icons/bi'

const UserDetails = () => {

  const params = useParams();
  const userId = params.id;

  const [userProfileImage, setuserProfileImage] = useState(null);
  const [userProfile, setuserProfile] = useState(null);

  useEffect(() => {
    if (userId) {
      const queryJson = {
        userId: userId
      }
      getByQueryParams('/user-profile/profile-image', queryJson)
        .then((response) => {
          if (response.status === 1) {
            setuserProfileImage(response.data.data);
          }
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error)
        })


      getByQueryParams("/user-profile", queryJson)
        .then((response) => {
          if (response.data.status === 1) {
            setuserProfile(response.data.data)
          }
          console.log(response.data)
        })
        .catch((error) => {
          console.log(error);
        })
    }
  }, [userId])

  return (
    <div className='user-details p-5 m-4 d-flex flex-column justify-content-center align-items-center'>

      {
        userProfileImage ? (
          <div className='user-image shadow'>
            <div>
              <img src={UserImage} alt='user-image' />
              <button title='Upload Image' className='edit-btn'>
                <BiEditAlt size={'15px'} fill='#fff' />
              </button>
            </div>
          </div>
        ) : (
          <div className='user-image shadow'>
            <div>
              <img src={UserImage} alt='user-image' />
              <button title='Upload Image' className='edit-btn'>
                <BiEditAlt size={'15px'} fill='#fff' />
              </button>
            </div>
          </div>
        )
      }
      {userProfile ? (
        <div className='user-detail-wrapper'>
          <h3 className="text-uppercase my-1 fs-1 mx-0 text-center">
            User Details
          </h3>

          <div className='row'>
            <div className="col-md-6 mt-5">
              <label htmlFor="userDetailsInputName" className='fs-2'>User Name:</label>
              <p id='userDetailsInputName' className='fs-2 fw-light'>{userProfile.name}</p>
            </div>

            <div className="col-md-6 mt-5">
              <label htmlFor="userDetailsInputSurname" className='fs-2'>User Surname:</label>
              <p id='userDetailsInputSurname' className='fs-2 fw-light'>{userProfile.surname}</p>
            </div>

            <div className="col-md-6 mt-5">
              <label htmlFor="userDetailsInputVillage" className='fs-2'>User Vilage:</label>
              <p id='userDetailsInputVillage' className='fs-2 fw-light'>{userProfile.village}</p>
            </div>

          </div>

        </div>
      ) : (
        <div>
          <p>No Data Found</p>
        </div>
      )}
    </div>
  )
}

export default UserDetails;