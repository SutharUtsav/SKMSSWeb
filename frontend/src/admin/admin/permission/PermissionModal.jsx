import React from "react";
import { useState } from "react";

const PermissionModal = () => {

  const defaultPermissionForm={
    permissionFor: "",
    permissions: "" 
  };

  const [permissionForm, setpermissionForm] = useState(defaultPermissionForm)

  const handleChange = (e) => {
    setpermissionForm({
      ...permissionForm,
      [e.target.name]:e.target.value})
  }

  const handleResetForm = () => {
    setpermissionForm(defaultPermissionForm);
  }

  const handleSubmitForm = (e) => {
    e.preventDefault();
    console.log(permissionForm)
  }

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
                  className="form-control"
                  id="permissionForInput"
                  aria-describedby="permissionForInput"
                  name="permissionFor"
                  value={permissionForm.permissionFor}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="permissionInput" className="form-label">
                  Permission Text
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="permissionInput"
                  aria-describedby="permissionInput"
                  name="permissions"
                  value={permissionForm.permissions}
                  onChange={(e)=> {setpermissionForm({...permissionForm,permissions:e.target.value})}}
                />
              </div>

              <div className="float-end mt-4">
                <button type="submit" className="btn btn-save m-2 px-4 py-2 fs-3 fw-normal rounded">Save</button>
                <button type="button" className="btn btn-secondary m-2 px-4 py-2 fs-3 fw-normal rounded" data-bs-dismiss="modal" onClick={handleResetForm}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionModal;
