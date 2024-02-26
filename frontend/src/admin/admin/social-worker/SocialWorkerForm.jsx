import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserLookUpModal from "../user/UserLookUpModal";
import { get } from "../../../service/api-service";

const SocialWorkerForm = (props) => {
  const defaultSocialWorkerForm = {
    name: "",
    surname: "",
    village: "",
    position: "",
  };

  const [socialWorkerForm, setsocialWorkerForm] = useState(
    defaultSocialWorkerForm
  );
  const [selectedUser, setselectedUser] = useState(null);
  const [userLookUp, setUserLookUp] = useState([]);
  const [modalForUser, setmodalForUser] = useState(false);

  const navigate = useNavigate();


   //Api call on page load to get all entities look up list
   useEffect(() => {
  
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



  const handleChange = (e) => {
    setsocialWorkerForm({
      ...socialWorkerForm,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="social-worker  content">
      <div className="content-header d-flex flex-row justify-content-between align-items-center">
        <h3 className="fs-1">
          {props.beforeUpdateData ? "update" : "create"} Social Worker
        </h3>

        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item fs-3">
              <Link to="/admin">Dashboard</Link>
            </li>
            <li className="breadcrumb-item fs-3">
              <Link to="/admin/social-worker">Social Worker </Link>
            </li>
            <li className="breadcrumb-item active fs-3  " aria-current="page">
              {props.beforeUpdateData ? "update" : "crate"} Social Worker
            </li>
          </ol>
        </nav>
      </div>

      <div className="card content-main">
        <div className="card-header content-title">
          <h4>New Social Worker</h4>
          <span className="pull-right">
            <button
              onClick={() => {
                navigate("/admin/social-worker");
              }}
            >
              Manage Social Worker
            </button>
          </span>
        </div>

        <div className="card-body content-body create-form-page">
          <label className="fs-2 fw-normal">
            <span className=" text-danger me-2 fs-2">*</span>
            Required Fields
          </label>

          <form className="row mt-5 gx-5 gy-5">
            <div className="col-md-6">
              <label htmlFor="socialWorkerInputUser">Select User</label>
              <i className="text-danger">*</i>
              <input
                type="text"
                data-bs-toggle="modal"
                className="form-control"
                data-bs-target="#userLookUpModal"
                placeholder="Select User..."
                readOnly={true}
                value={
                  selectedUser === null
                    ? "Select User..."
                    : `Name : ${selectedUser.name}, Surname :${selectedUser.surname}, Village: ${selectedUser.village}`
                }
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="socialWorkerInputPosition">
                Social Worker Position
              </label>
              <i className="text-danger">*</i>
              <input
                id="socialWorkerInputPosition"
                type="text"
                name="position"
                placeholder="Enter Social Worker Position"
                className="form-control"
                required={true}
                value={socialWorkerForm.position}
                onChange={handleChange}
              />
            </div>
          </form>
        </div>
      </div>

      <UserLookUpModal
        userLookUp={userLookUp}
        selectedUser={selectedUser}
        setselectedUser={setselectedUser}
        modalForUser={modalForUser}
        setmodalForUser={setmodalForUser}
        isImageShown={true}
      />
    </div>
  );
};

export default SocialWorkerForm;
