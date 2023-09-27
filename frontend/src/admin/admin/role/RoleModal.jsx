import React, { useState } from "react";
import { RolePermissionEntity } from "../../../consts/RolePermissioEntity";

const RoleModal = () => {
  const [newRoleForm, setNewRoleForm] = useState({
    name: null,
    description: null,
  });

  return (
    <div
      className="modal fade"
      id="createRoleModal"
      tabIndex="-1"
      aria-labelledby="createRoleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="createRoleModalLabel">
              New Role
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
                <label htmlFor="roleNameInput" className="form-label">
                  Role Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="roleNameInput"
                  aria-describedby="roleNameInput"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="roleDescInput" className="form-label">
                  Role Description
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="roleDescInput"
                  aria-describedby="roleDescInput"
                />
              </div>

              <div className="table-responsive">
                <table className="table table-lg table-bordered">
                  <tbody>
                    {Object.keys(RolePermissionEntity).map((key, index) => (
                      <tr key={index}>
                        <th>{RolePermissionEntity[key]?.name}</th>
                        <td>
                          <div className="row">
                            <div className=" mb-2">
                              {Object.keys(
                                RolePermissionEntity[key]?.permissions
                              ).map((permission, ind) => (
                                <div
                                  className="form-check form-switch"
                                  key={ind}
                                >
                                  <input
                                    type="checkbox"
                                    name=""
                                    id={`checkbox_${index}${ind}`}
                                    className="form-check-input"
                                  />
                                  <label
                                    htmlFor={`checkbox_${index}${ind}`}
                                    style={{ marginLeft: "5px" }}
                                  >
                                    {
                                      RolePermissionEntity[key]?.permissions[
                                        permission
                                      ]
                                    }
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleModal;
