import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { edit, get, post } from "../../../service/api-service";
import "./Event.css";
import axios from "axios";
import { EnvConfig } from "../../../config/env-config";

const EventForm = (props) => {
  const navigate = useNavigate();
  const params = useParams();
  const eventId = params.id;

  console.log(eventId)

  const defaultEventForm = {
    title: "",
    description: "",
    eventOn: "",
    isActivity: false,
    activityCategory: "",
  };

  const [eventForm, seteventForm] = useState(defaultEventForm);
  const [isActivity, setIsActivity] = useState(false);
  const [mainImageFile, setmainImageFile] = useState(null);

  useEffect(() => {
    if (eventId) {
      get(`/event/${eventId}`)
        .then((response) => {
          if (response.data.status === 1) {
            const event = response.data.data;
            seteventForm({
              title: event.title ? event.title : "",
              description: event.description ? event.description : "",
              eventOn: event.eventOn ? event.eventOn : "",
              isActivity: event.isActivity ? event.isActivity : false,
              activityCategory: event.activityCategory
                ? event.activityCategory
                : "",
            });

            setIsActivity(event.isActivity);
          }
          console.log(response.data.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }

    return () => {
      seteventForm(defaultEventForm);
      setmainImageFile(null);
    };
  }, [eventId]);

  const handleResetForm = () => {
    seteventForm(defaultEventForm);
    setmainImageFile(null);
  };

  const handleChange = (e) => {
    
    seteventForm({
      ...eventForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();

    if (!eventForm.title || eventForm.title === "") {
      console.log("Title is required");
    } else if (!eventForm.description || eventForm.description === "") {
      console.log("Description is required");
    } else if (!eventForm.eventOn || eventForm.eventOn === "") {
      console.log("Event Date is required");
    } else if (!mainImageFile && !eventId) {
      console.log("Main Image URL is required");
    } else {
      console.log("EventForm :" + JSON.stringify(eventForm));
      if (!eventId) {
        let formData = new FormData();

        formData.append("mainImageURL", mainImageFile);

        Object.keys(eventForm).forEach((data) => {
          formData.append(data.toString(), eventForm[data].toString());
        });

        let config = {
          method: "post",
          maxBodyLength: Infinity,
          url: `${EnvConfig.LOCAL_URL}${EnvConfig.LOCAL_SUBURL}/event`,
          headers: {},
          data: formData,
        };

        axios
          .request(config)
          .then((response) => {
            // if(response.data.status === 1){

            // }
            if (props.setisReloadData) {
              props.setisReloadData(true);
            }
            console.log(response);
            navigate("/admin/events");
          })
          .catch((error) => {
            console.log(error);
          })
          .finally(() => {
            seteventForm(defaultEventForm);
            setmainImageFile(null);
          });
      } else {
        let formData = new FormData();

        if (mainImageFile !== null) {
          formData.append("mainImageURL", mainImageFile);
        }

        Object.keys(eventForm).forEach((data) => {
          formData.append(data.toString(), eventForm[data].toString());
        });

        let config = {
          method: "put",
          maxBodyLength: Infinity,
          url: `${EnvConfig.LOCAL_URL}${EnvConfig.LOCAL_SUBURL}/event?id=${eventId}`,
          headers: {},
          data: formData,
        };

        axios
          .request(config)
          .then((response) => {
            if (response.data.status === 1) {
              if (props.setisUpdateClicked) {
                props.setisUpdateClicked(false);
              }
              if (props.setisReloadData) {
                props.setisReloadData(true);
              }
            }
            console.log(response);
            navigate("/admin/events");
          })
          .catch((error) => {
            console.log(error);
          })
          .finally(() => {
            seteventForm(defaultEventForm);
            setmainImageFile(null);
          });
      }
    }
  };

  return (
    <div className="events content">
      <div className="content-header d-flex flex-row justify-content-between align-items-center">
        <h3 className="fs-1">
          {props.beforeUpdateData ? "update" : "create"} Event
        </h3>

        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item fs-3">
              <Link to="/admin">Dashboard</Link>
            </li>
            <li className="breadcrumb-item fs-3">
              <Link to="/admin/events">Event</Link>
            </li>
            <li className="breadcrumb-item active fs-3  " aria-current="page">
              {props.beforeUpdateData ? "update" : "crate"} Event
            </li>
          </ol>
        </nav>
      </div>

      <div className="card content-main">
        <div className="card-header content-title">
          <h4>New Event</h4>
          <span className="pull-right">
            <button
              onClick={() => {
                if (props.setisUpdateClicked) {
                  props.setisUpdateClicked(false);
                  props.setbeforeUpdateData(null);
                } else {
                  navigate("/admin/events");
                }
              }}
            >
              Manage Event
            </button>
          </span>
        </div>

        <div className="card-body content-body create-form-page">
          <label className="fs-2 fw-normal">
            <span className=" text-danger me-2 fs-2">*</span>
            Required Fields
          </label>
          <form className="row mt-5 gx-5 gy-5" onSubmit={handleSubmitForm}>
            <div className="col-md-6">
              <label htmlFor="eventInputTitle">Event Title</label>
              <i className="text-danger">*</i>
              <input
                id="eventInputTitle"
                type="text"
                name="title"
                placeholder="Enter Event Title"
                className="form-control"
                required={true}
                value={eventForm.title}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="eventInputDescription">Event Description</label>
              <i className="text-danger">*</i>
              <textarea
                id="eventInputDescription"
                type="text"
                name="description"
                placeholder="Enter Event Description"
                className="form-control"
                required={true}
                value={eventForm.description}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="eventInputeventOn">Event Date</label>
              <i className="text-danger">*</i>
              <input
                id="eventInputeventOn"
                type="date"
                name="eventOn"
                placeholder="Enter Event Date"
                className="form-control"
                required={true}
                value={eventForm.eventOn}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label></label>
              <div className="form-check h-100 d-flex align-items-center">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="isActivity"
                  id="eventInputIsCategory"
                  value={isActivity}
                  onChange={() => {
                    seteventForm({
                      ...eventForm,
                      isActivity: !isActivity,
                    });

                    setIsActivity(!isActivity);
                  }}
                />
                <label
                  className="form-check-label"
                  htmlFor="eventInputIsCategory"
                >
                  Is Activity?
                </label>
              </div>
            </div>

            {eventForm.isActivity ? (
              <div className="col-md-6">
                <label htmlFor="eventInputActivityCatagory">
                  Activity Category
                </label>
                <select className="form-select" name="activityCatagory" id="eventInputActivityCatagory" onChange={handleChange}>
                  <option value=""></option>
                  <option value="social">Social</option>
                  <option value="educational">Educational</option>
                  <option value="other">Other</option>
                </select>
                {/* <input
                  id="eventInputActivityCatagory"
                  type="text"
                  name="activityCatagory"
                  placeholder="Enter Activity Catagory"
                  className="form-control"
                  value={eventForm.activityCategory}
                  onChange={handleChange}
                /> */}
              </div>
            ) : null}

            <div className="col-md-12">
              <div className="form-group">
                <label htmlFor="eventInputMainImage">Event Main Image</label>
                {eventId ? <i className="text-danger">*</i> : null}
                <input
                  type="file"
                  name="mainImageURL"
                  id="eventInputMainImage"
                  required={eventId===undefined || eventId === null}
                  accept=".png, .webp, .jpg, .jpeg"
                  className="form-control"
                  onChange={(e) => {
                    const file = e.target.files[0];

                    if (file) {
                      // Check if the file is an image file.
                      if (!file.type.match(/^image\//)) {
                        console.log("Please select an image file");
                      } else {
                        setmainImageFile(file);
                        console.log(file);
                      }
                    } else {
                      console.log("Please select an image file first");
                    }
                  }}
                />
              </div>
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

export default EventForm;
