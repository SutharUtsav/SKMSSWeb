import React, { useState } from "react";
import Event from "../../../components/Events/Event";
import { useParams } from "react-router-dom";
import { EnvConfig } from "../../../config/env-config";
import axios from "axios";

const EventDetails = () => {
  const params = useParams();
  const eventId = params.id;

  const [imageFiles, setimageFiles] = useState([]);
  const [error, seterror] = useState(null);

  const handleSubmitForm = (e) => {
    e.preventDefault();

    let formData = new FormData();

    if (imageFiles) {
      for(const imageFile of imageFiles){
        formData.append("imageURLs", imageFile);
      }
    }

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${EnvConfig.LOCAL_URL}${EnvConfig.LOCAL_SUBURL}/event/images?eventId=${eventId}`,
      headers: {},
      data: formData,
    };

    axios
      .request(config)
      .then((response) => {
        if(response.data.status === 1){
          console.log(response.data.data)
        }
        else{
          console.log(response)
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setimageFiles([]);
      });
  };

  return (
    <div className="events">
      <form className="form-container" onSubmit={handleSubmitForm}>
        <div className="upload-files-container">
          <div className="drag-file-area">
            <span
              className="material-icons-outlined upload-icon"
              style={{ fontSize: "3.5rem" }}
            >
              upload images
            </span>

            <label className="label" style={{ fontSize: "15px" }}>
              <span className="browse-files">
                <input
                  type="file"
                  className="default-file-input"
                  name="image"
                  multiple="multiple"
                  onChange={(e) => {
                    const uploaded = [...imageFiles];
                    let err = null;
                    const files = Array.prototype.slice.call(e.target.files);
                    files.some((file) => {
                      if (
                        imageFiles.findIndex((f) => f.name === file.name) === -1
                      ) {
                        // Check if the file is an image file.
                        uploaded.push(file);

                        if (!file.type.match(/^image\//)) {
                          err = "Please select an image file";
                        }
                      } else {
                        
                        err = "Please select an image file first";
                      }
                    });

                    if (!err) {
                      setimageFiles(uploaded);
                    }
                    else{
                      seterror(err);
                    }
                  }}
                />
                <br />
                <span className="browse-files-text">Browse files </span>
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

          {imageFiles && imageFiles.length > 0? (
            <div className="file-block">
              {imageFiles.map((imageFile, index) => (
                <div className="file-info" key={index}>
                  <span className="material-icons-outlined file-icon">
                    description:
                  </span>
                  <span className="file-name fs-4"> {imageFile.name}</span> |
                  <span className="file-size fs-4"> {imageFile.size}</span>
                </div>
              ))}
            </div>
          ) : null}
          <button type="submit" className="upload-button">
            Upload
          </button>
        </div>
      </form>

      <Event />
    </div>
  );
};

export default EventDetails;
