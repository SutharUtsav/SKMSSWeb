import React from "react";

const PermissionModal = () => {
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
            ></button>
          </div>

          <div className="modal-body">
            <form>
              <div className="mb-3">
                <label htmlFor="permissionForInput" className="form-label">
                  Permission for Entiry Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="permissionForInput"
                  aria-describedby="permissionForInput"
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
                />
              </div>

              <div className="float-end mt-4">

              <button type="submit" className="btn btn-save m-2 px-4 py-2 fs-3 fw-normal rounded">Save</button>
              <button type="submit" className="btn btn-secondary m-2 px-4 py-2 fs-3 fw-normal rounded">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionModal;
