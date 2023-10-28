import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./Role.css";
import "../Common.css";
import { del, get } from "../../../service/api-service";
import { BiEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { BiRefresh } from "react-icons/bi";
import RoleModal from "./RoleModal";
import useApiCall from "../../../hooks/useApiCall";
import DecisionModal from "../../master/decisionmodal/DecisionModal";
import { EnumConsts } from "../../../consts/EnumConsts";

export const Role = () => {
  const defaultRoleForm = {
    name: "",
    description: "",
    rolePermissionIds: [],
    roleType: "CustomRole",
  };

  let { data, setData, error, setError, loading, setLoading } = useApiCall(() =>
    get("/role")
  );

  const [isReloadData, setisReloadData] = useState(false);
  const [roleForm, setroleForm] = useState(defaultRoleForm);
  const [updateRecordId, setupdateRecordId] = useState(null);
  const [deleteRecordId, setdeleteRecordId] = useState(null);


  useEffect(() => {
    return () => {
      setdeleteRecordId(null);
    }
  }, [])
  

  //Reload Data on isReloadData is true
  useEffect(() => {
    if (isReloadData) {
      get("/role")
        .then((response) => {
          // console.log(response);
          if (response.data.status === 1) {
            setData(response.data);
          } else {
            setError(response.data.error);
          }
        })
        .catch((err) => {
          error = err;
        })
        .finally(() => {
          setisReloadData(false);
        });
    }
  }, [isReloadData]);



  //Delete Api Call
  const handleDelete = (id) => {
    del("/role", id)
      .then((response) => {
        if (response && response.data.status === 1) {
          setisReloadData(true);
        }
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <div className="roles content">
        <div className="content-header d-flex flex-row justify-content-between align-items-center">
          <h3 className="fs-1">Role</h3>

          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item fs-3">
                <Link to="/admin">Dashboard</Link>
              </li>
              <li className="breadcrumb-item active fs-3  " aria-current="page">
                Role
              </li>
            </ol>
          </nav>
        </div>
        <div className="card content-main">
          <div className="card-header content-title">
            <h4>Role</h4>
            <span className="pull-right">
              <button
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#createRoleModal"
              >
                Add New
              </button>
            </span>
          </div>

          <div className="card-body content-body">
            <div className="row mb-2">
              <div className="input-search col-md-3 offset-md-8">
                <h4 className="box-title">Search</h4>
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                />
              </div>
              <div className="text-center col-md-1">
                <button className="btn btn-refresh" type="submit">
                  <BiRefresh fill="#fff" size="2.5rem" />
                </button>
              </div>
            </div>

            {data && data.status === 1 ? (
              <div className="table-reponsive mt-5">
                <table
                  role="table"
                  aria-busy="false"
                  aria-colcount={3}
                  className="table b-table table-bordered table-sm b-table-stacked-md"
                >
                  <thead role="rowgroup" className="">
                    <tr role="row" className="">
                      <th
                        className="position-relative text-center"
                        role="columnheader"
                        scope="col"
                        tabIndex={0}
                        aria-colindex="1"
                        aria-sort="none"
                      >
                        <div>ID</div>
                        {/* <span className='sr-only'> (Click to sort ascending) </span> */}
                      </th>

                      <th
                        className="position-relative text-center"
                        role="columnheader"
                        scope="col"
                        tabIndex={0}
                        aria-colindex="2"
                        aria-sort="none"
                      >
                        <div>Name</div>
                        {/* <span className='sr-only'> (Click to sort ascending) </span> */}
                      </th>

                      <th
                        className="position-relative text-center"
                        role="columnheader"
                        scope="col"
                        tabIndex={0}
                        aria-colindex="3"
                        aria-sort="none"
                      >
                        <div>Description</div>
                        {/* <span className='sr-only'> (Click to sort ascending) </span> */}
                      </th>

                      <th
                        className="position-relative text-center"
                        role="columnheader"
                        scope="col"
                        tabIndex={0}
                        aria-colindex="4"
                        aria-sort="none"
                      >
                        <div>RoleType</div>
                        {/* <span className='sr-only'> (Click to sort ascending) </span> */}
                      </th>

                      <th
                        className="position-relative"
                        role="columnheader"
                        scope="col"
                        tabIndex={0}
                        aria-colindex="5"
                        aria-sort="none"
                      >
                        <div>Action</div>
                        {/* <span className='sr-only'> (Click to sort ascending) </span> */}
                      </th>
                    </tr>
                  </thead>

                  <tbody role="rowgroup">
                    {data.data.map((role, index) => (
                      <tr role="row" aria-rowindex="1" className="" key={index}>
                        <td
                          aria-colindex="1"
                          data-label="ID"
                          role="cell"
                          className="text-center"
                        >
                          {/* <div>{data.data[0].id}</div> */}
                          <div>{index + 1}</div>
                        </td>

                        <td
                          aria-colindex="2"
                          data-label="Name"
                          role="cell"
                          className="text-center"
                        >
                          <div>{role.name}</div>
                        </td>

                        <td
                          aria-colindex="3"
                          data-label="Description"
                          role="cell"
                          className="text-center"
                        >
                          <div>{role.description}</div>
                        </td>

                        <td
                          aria-colindex="4"
                          data-label="RoleType"
                          role="cell"
                          className="text-center"
                        >
                          <div>{role.roleType}</div>
                        </td>

                        <td aria-colindex="5" data-label="Actions" role="cell">
                          <div className="action-btns">
                            <button
                              title="Edit"
                              className="btn btn-sm btn-primary btn-edit"
                              data-bs-toggle="modal"
                              data-bs-target="#createRoleModal"
                              onClick={() => {
                                setroleForm({
                                  ...roleForm,
                                  name: role.name,
                                  description: role.description,
                                  rolePermissionIds: role.permissionIds.map(
                                    (permisssionId) => {
                                      return permisssionId.rolePermissionId;
                                    }
                                  ),
                                });
                                setupdateRecordId(role.id);
                              }}
                            >
                              <BiEdit
                                fill="#fff"
                                size={"2.5rem"}
                                className="m-1"
                              />
                            </button>
                            <button
                              title="Delete"
                              className="btn btn-sm btn-danger btn-delete"
                              data-bs-toggle="modal"
                              data-bs-target={`#${EnumConsts.DECISIONMODALID}`}
                              onClick={() => {
                                setdeleteRecordId(role.id);
                              }}
                            >
                              <MdDelete
                                fill="#fff"
                                size={"2.5rem"}
                                className="m-1"
                              />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <>loading</>
            )}
          </div>
        </div>
      </div>
      <RoleModal
        roleForm={roleForm}
        setroleForm={setroleForm}
        setisReloadData={setisReloadData}
        updateRecordId={updateRecordId}
        setupdateRecordId={setupdateRecordId}
      />
      <DecisionModal onYes={() => {
        handleDelete(deleteRecordId)
      }} deleteRecordId={deleteRecordId} setdeleteRecordId={setdeleteRecordId} topic="Delete Role" message="Are you sure you want to delete this Role?"/>
      
    </>
  );
};
