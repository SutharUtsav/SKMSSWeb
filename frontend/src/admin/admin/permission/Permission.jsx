import React, { useState } from "react";
import { BiEdit, BiRefresh } from "react-icons/bi";
import { Link } from "react-router-dom";
import { del, get } from "../../../service/api-service";
import { MdDelete } from "react-icons/md";
import { useEffect } from "react";
import PermissionModal from "./PermissionModal";
import useApiCall from "../../../hooks/useApiCall";

const Permission = () => {
  let { data, setData, error, setError, loading, setLoading } = useApiCall(() =>
    get("/role-permission")
  );

  const defaultPermissionForm = {
    permissionFor: "",
    permissions: ""
  };

  const [isReloadData, setisReloadData] = useState(false);
  const [permissionForm, setpermissionForm] = useState(defaultPermissionForm)
  const [updateRecordId, setupdateRecordId] = useState(null)

  //Reload Data on isReloadData is true
  useEffect(() => {
    if (isReloadData) {
      get("/role-permission")
        .then((response) => {
          console.log(response);
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
    console.log(id);
    del("/role-permission", id)
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
      <div className="permissions content">
        <div className="content-header d-flex flex-row justify-content-between align-items-center">
          <h3 className="fs-1">Permissions</h3>

          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item fs-3">
                <Link to="/admin">Dashboard</Link>
              </li>
              <li className="breadcrumb-item active fs-3  " aria-current="page">
                Permissions
              </li>
            </ol>
          </nav>
        </div>

        <div className="card content-main">
          <div className="card-header content-title">
            <h4>Permissions</h4>
            <span className="pull-right">
              <button
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#createPermissionModal"
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
                      <div>Entity</div>
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
                      <div>Permissions</div>
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

                {data && data.status === 1 ? (
                  <tbody role="rowgroup">
                    {data.data.map((permission, index) => (
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
                          <div>{permission.permissionFor}</div>
                        </td>

                        <td
                          aria-colindex="3"
                          data-label="Description"
                          role="cell"
                          className="text-center"
                        >
                          <div>{permission.permissions}</div>
                        </td>

                        <td aria-colindex="5" data-label="Actions" role="cell">
                          <div className="action-btns">
                            <button
                              title="Edit"
                              className="btn btn-sm btn-primary btn-edit"
                              data-bs-toggle="modal"
                              data-bs-target="#createPermissionModal"

                              onClick={()=>{
                                setupdateRecordId(permission.id);
                                setpermissionForm({
                                  permissionFor : permission.permissionFor,
                                  permissions : permission.permissions 
                                })

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
                              onClick={() => handleDelete(permission.id)}
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
                ) : null}
              </table>

              {error ? (
                <div>{error.errorMsg}</div>
              ) : (
                <>{loading ? <div>loading</div> : null}</>
              )}
            </div>
          </div>
        </div>
      </div>

      <PermissionModal setisReloadData={setisReloadData} permissionForm={permissionForm} setpermissionForm={setpermissionForm} updateRecordId={updateRecordId}/>
    </>
  );
};

export default Permission;
