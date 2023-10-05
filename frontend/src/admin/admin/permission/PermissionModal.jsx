import React, { useEffect } from "react";
import { useState } from "react";
import { add, edit } from "../../../service/api-service";
import { useRef } from "react";

const PermissionModal = (props) => {
  const defaultPermissionForm = {
    permissionFor: "",
    permissions: "",
  };

  useEffect(() => {
    return () => {
      props.setpermissionForm(defaultPermissionForm);
    };
  }, []);

  const closeModal = useRef();

  const handleChange = (e) => {
    props.setpermissionForm({
      ...props.permissionForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleResetForm = () => {
    props.setpermissionForm(defaultPermissionForm);
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();

    if (props.updateRecordId === null) {
      add("/role-permission", props.permissionForm)
        .then((response) => {
          if (response && response.data.status === 1) {
            props.setisReloadData(true);
          } else {
            console.log(response);
          }
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          closeModal.current.click();
        });
    } else {
      edit("/role-permission", props.updateRecordId, props.permissionForm)
        .then((response) => {
          if (response && response.data.status === 1) {
            props.setisReloadData(true);
          } else {
            console.log(response);
          }
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          closeModal.current.click();
        });
    }
  };

  return (
    <div
      className="modal fade"
      id="createPermissionModal"
      tabIndex="-1"
      aria-labelledby="createPermissionModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="createPermissionModalLabel">
              New Permission
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={handleResetForm}
              ref={closeModal}
            ></button>
          </div>

          <div className="modal-body">
            <form onSubmit={handleSubmitForm}>
              <div className="mb-3">
                <label htmlFor="permissionForInput" className="form-label">
                  Permission for Entity Name
                </label>
                <input
                  type="text"
                  className="form-control fw-light"
                  id="permissionForInput"
                  aria-describedby="permissionForInput"
                  name="permissionFor"
                  value={props.permissionForm.permissionFor}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="permissionInput" className="form-label">
                  Permission Text
                </label>
                <input
                  type="text"
                  className="form-control fw-light"
                  id="permissionInput"
                  aria-describedby="permissionInput"
                  name="permissions"
                  value={props.permissionForm.permissions}
                  onChange={(e) => {
                    props.setpermissionForm({
                      ...props.permissionForm,
                      permissions: e.target.value,
                    });
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
    </div>
  );
};

export default PermissionModal;
