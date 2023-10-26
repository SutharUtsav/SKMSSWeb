import React, { useEffect, useRef, useState } from "react";
import { RolePermissionEntity } from "../../../consts/RolePermissioEntity";
import { add, edit, get } from "../../../service/api-service";

const RoleModal = (props) => {
  const defaultRoleForm = {
    name: "",
    description: "",
    rolePermissionIds: [],
    roleType: "CustomRole",
  };

  const closeModal = useRef();
  const [permissionList, setpermissionList] = useState(null);

  const handleResetForm = () => {
    props.setupdateRecordId(null);
    props.setroleForm(defaultRoleForm);
  };

  const handleChange = (e) => {
    props.setroleForm({
      ...props.roleForm,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    get("/role-permission")
      .then((response) => {
        if (response && response.data.status === 1) {
          const groupedData = response.data.data.reduce((result, item) => {
            const key = item.permissionFor;
            // Create an array for each 'permissionFor' value if it doesn't exist
            if (!result[key]) {
              result[key] = [];
            }
            // Push the item into the corresponding array
            result[key].push({ title: item.permissions, id: item.id });
            return result;
          }, {});
          setpermissionList(groupedData);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    return () => {
      handleResetForm();
    };
  }, []);

  //Method to handle changes of permissions
  const handlePermissionSelection = (id) => {
    //if Id already present then remove it
    let temp_arr = props.roleForm.rolePermissionIds;
    const index = temp_arr.indexOf(id);
    if (index !== -1) {
      temp_arr.splice(index, 1);
    }
    //else add it
    else {
      temp_arr.push(id);
    }
    props.setroleForm({
      ...props.roleForm,
      rolePermissionIds: temp_arr,
    });
  };

  //Method to handle form submission
  const handleSubmitForm = (e) => {
    e.preventDefault();

    if (!props.roleForm.name || props.roleForm.name === "" || !props.roleForm.description || props.roleForm.description === "") {
      console.log("Role name or description is not selected");
    }
    else {
      if (props.updateRecordId === null) {
        add("/role", props.roleForm)
          .then((response) => {
            if (response && response.data.status === 1) {
              props.setisReloadData(true);
            }
            console.log(response);
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            props.setupdateRecordId(null);
            props.setroleForm(defaultRoleForm);
            closeModal.current.click();
          });
      } else {
        edit("/role", props.updateRecordId, props.roleForm)
          .then((response) => {
            if (response && response.data.status === 1) {
              props.setisReloadData(true);
            }
            console.log(response);
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            props.setupdateRecordId(null);
            props.setroleForm(defaultRoleForm);
            closeModal.current.click();
          });
      }
    }

  };

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
              ref={closeModal}
              onClick={handleResetForm}
            ></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmitForm}>
              <div className="mb-3">
                <label htmlFor="roleNameInput" className="form-label">
                  Role Name
                </label>
                <input
                  type="text"
                  className="form-control fw-light"
                  id="roleNameInput"
                  name="name"
                  aria-describedby="roleNameInput"
                  value={props.roleForm.name}
                  required={true}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="roleDescInput" className="form-label">
                  Role Description
                </label>
                <input
                  type="text"
                  className="form-control fw-light"
                  id="roleDescInput"
                  name="description"
                  aria-describedby="roleDescInput"
                  value={props.roleForm.description}
                  required={true}
                  onChange={handleChange}
                />
              </div>

              <div className="table-responsive">
                <table className="table table-lg table-bordered">
                  <tbody>
                    {permissionList !== null &&
                      Object.keys(permissionList).map((key, index) => (
                        <tr key={index}>
                          <th>{key}</th>
                          <td>
                            <div className="row">
                              <div className=" mb-2">
                                {permissionList[key].map((permission, ind) => (
                                  <div
                                    className="form-check form-switch"
                                    key={ind}
                                  >
                                    <input
                                      type="checkbox"
                                      name=""
                                      id={`checkbox_${index}${ind}`}
                                      className="form-check-input"
                                      checked={
                                        props.roleForm.rolePermissionIds.indexOf(
                                          permission.id
                                        ) !== -1
                                          ? true
                                          : false
                                      }
                                      onChange={() => {
                                        handlePermissionSelection(
                                          permission.id
                                        );
                                      }}
                                    />
                                    <label
                                      htmlFor={`checkbox_${index}${ind}`}
                                      style={{ marginLeft: "5px" }}
                                    >
                                      {permission.title}
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

export default RoleModal;
