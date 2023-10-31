import axios from "axios";
import React, { useRef, useState } from "react";
import { EnvConfig } from "../../../config/env-config";

const UserProfileImageModal = (props) => {
  const [selectedFile, setselectedFile] = useState(null);
  const [error, seterror] = useState(null);

  const closeModalRef = useRef(null);

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (error === null && selectedFile) {
      if (props.userId) {
        console.log(props.userId);

        let formData = new FormData();

        formData.append("image", selectedFile);

        let config = {
          method: "post",
          maxBodyLength: Infinity,
          url: `${EnvConfig.LOCAL_URL}${EnvConfig.LOCAL_SUBURL}/user-profile/upload-image?userId=${props.userId}`,
          headers: {},
          data: formData,
        };

        axios
          .request(config)
          .then((response) => {
            if (response.data.status === 1) {
              props.setisReloadProfileImage(true);
              closeModalRef.current.click();
            }
            console.log(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        seterror("user id is not selected");
      }
    }
  };

  const handleRemoveProfileImage = () => {

    if (props.userId) {
      let config = {
        method: "delete",
        maxBodyLength: Infinity,
        url: `${EnvConfig.LOCAL_URL}${EnvConfig.LOCAL_SUBURL}/user-profile/remove-image?userId=${props.userId}`,
        headers: {},
      };
    
      axios.request(config)
      .then((response)=>{
        if (response.data.status === 1) {
          props.setisReloadProfileImage(true);
          closeModalRef.current.click();
        }
        console.log(response.data);
      })
      .catch((error)=>{
        console.log(error)
      })
    }
    else {
      seterror("user id is not selected");
    }


  };

  return (
    <div className="modal fade" id="uploadProfileImageModal" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              ref={closeModalRef}
              onClick={() => {
                setselectedFile(null);
                seterror(null);
              }}
            ></button>
          </div>

          <div className="modal-body d-flex flex-column align-items-center">
            <form className="form-container" onSubmit={handleSubmitForm}>
              <div className="upload-files-container">
                <div className="drag-file-area">
                  <span className="material-icons-outlined upload-icon">
                    file upload
                  </span>

                  <label className="label">
                    <span className="browse-files">
                      <input
                        type="file"
                        className="default-file-input"
                        name="image"
                        onChange={(e) => {
                          const file = e.target.files[0];

                          if (file) {
                            // Check if the file is an image file.
                            if (!file.type.match(/^image\//)) {
                              seterror("Please select an image file");
                            } else {
                              seterror(null);
                              setselectedFile(file);
                              console.log(file);
                            }
                          } else {
                            setselectedFile(null);
                            seterror("Please select an image file first");
                          }
                        }}
                      />
                      <span className="browse-files-text">Browse file </span>
                      <span>from device</span>
                    </span>
                  </label>
                </div>
                {error !== null ? (
                  <span className="cannot-upload-message">
                    <span className="material-icons-outlined fs-4 fw-light text-danger">
                      Error : {error}
                    </span>
                  </span>
                ) : null}
                {selectedFile ? (
                  <div className="file-block">
                    <div className="file-info">
                      <span className="material-icons-outlined file-icon">
                        description:
                      </span>
                      <span className="file-name fs-4">
                        {" "}
                        {selectedFile.name}
                      </span>{" "}
                      |
                      <span className="file-size fs-4">
                        {" "}
                        {selectedFile.size}
                      </span>
                    </div>
                  </div>
                ) : null}

                <button type="submit" className="upload-button">
                  Upload
                </button>
              </div>
            </form>
            <button
              type="button"
              className="upload-button bg-danger"
              onClick={handleRemoveProfileImage}
            >
              Remove Image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileImageModal;
