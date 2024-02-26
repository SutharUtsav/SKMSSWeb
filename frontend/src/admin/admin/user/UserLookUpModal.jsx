import React, { useRef } from "react";
import "../Common.css";
import UserImage from "../../../images/profile.jpg"
const UserLookUpModal = (props) => {
  const closeModal = useRef(null);

  return (
    <div
      className="modal fade"
      data-bs-backdrop="static"
      id="userLookUpModal"
      tabIndex="-1"
      aria-labelledby="userLookUpModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header p-5 fs-1 fw-normal">
            <h5>Select User</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              ref={closeModal}
              onClick={() => {
                if (props.setmodalForFather) props.setmodalForFather(false);
                if (props.selectedMother) props.setmodalForMother(false);
                if (props.selectedUser) props.setmodalForUser(false);
              }}
            ></button>
          </div>
          <div className="modal-body fs-2 fw-light">
            {props.userLookUp.length ? (
              <>
                <div
                  className="border-bottom px-5 py-4 lookup-modal"
                  data-bs-dismiss="modal"
                  onClick={() => {
                    if (props.modalForFather) {
                      props.setselectedFather(null);
                    } else if (props.modalForMother) {
                      props.setselectedMother(null);
                    }
                  }}
                >
                  {`No ${
                    props.modalForFather
                      ? "Father"
                      : props.modalForMother
                      ? "Mother"
                      : "User"
                  } Selected`}
                </div>
                {props.userLookUp.map((user, index) => (
                  <div key={index}>
                    {(props.modalForFather && user.gender === "MALE") ||
                    (props.modalForMother && user.gender === "FEMALE") ? (
                      <div
                        className={`border-bottom px-5 py-4 lookup-modal ${
                          (props.selectedFather &&
                            props.selectedFather.name === user.name) ||
                          (props.selectedMother &&
                            props.selectedMother.name === user.name) ||
                          (props.selectedUser &&
                            props.selectedUser.name === user.name)
                            ? "active"
                            : ""
                        }`}
                        data-bs-dismiss="modal"
                        onClick={() => {
                          if (props.modalForFather) {
                            props.setselectedFather(user);
                          } else if (props.modalForMother) {
                            props.setselectedMother(user);
                          } else if (props.modalForUser) {
                            props.setselectedUser(user);
                          }

                          closeModal.current.click();
                        }}
                      >
                        {props.isImageShown ? (
                          <div className="d-flex align-items-center justify-content-between">
                            {user.image ? (
                              <img src={user.image} alt="user=profile-image" />
                            ) : (
                              <img src={UserImage} alt="user=profile-image" />
                            )}
                            <div className="d-flex align-items-center justify-content-between">
                              <p className="d-block">
                                <b>Name :</b>
                                <span>{user.name}</span>
                              </p>
                              <p>
                                <b>Surname : </b>
                                {user.surname}
                              </p>
                              <p>
                                <b>Village : </b>
                                {user.village}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="d-flex align-items-center justify-content-between">
                            <p className="d-block">
                              <b>Name :</b>
                              <span>{user.name}</span>
                            </p>
                            <p>
                              <b>Surname : </b>
                              {user.surname}
                            </p>
                            <p>
                              <b>Village : </b>
                              {user.village}
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div
                        className={`border-bottom px-5 py-4 lookup-modal ${
                          props.selectedUser &&
                          props.selectedUser.name === user.name
                            ? "active"
                            : ""
                        }`}
                        data-bs-dismiss="modal"
                        onClick={() => {
                          if (props.modalForUser) {
                            props.setselectedUser(user);
                          }

                          closeModal.current.click();
                        }}
                      >
                        {props.isImageShown ? (
                          <div className="d-flex align-items-center justify-content-between">
                            {user.image ? (
                              <img src={user.image} alt="user=profile-image" />
                            ) : (
                              <img src={UserImage} alt="user=profile-image" />
                            )}
                            <div className="d-flex align-items-center justify-content-between">
                              <p className="d-block">
                                <b>Name :</b>
                                <span>{user.name}</span>
                              </p>
                              <p>
                                <b>Surname : </b>
                                {user.surname}
                              </p>
                              <p>
                                <b>Village : </b>
                                {user.village}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="d-flex align-items-center justify-content-between">
                            <p className="d-block">
                              <b>Name :</b>
                              <span>{user.name}</span>
                            </p>
                            <p>
                              <b>Surname : </b>
                              {user.surname}
                            </p>
                            <p>
                              <b>Village : </b>
                              {user.village}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </>
            ) : (
              <div>loading ...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLookUpModal;
