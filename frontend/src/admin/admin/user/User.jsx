import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { del, get } from "../../../service/api-service";
import { BiRefresh, BiSolidUserDetail } from "react-icons/bi";
import { BiEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import useApiCall from "../../../hooks/useApiCall";
import { useDispatch } from "react-redux";
import { EnumConsts } from "../../../consts/EnumConsts";
import DecisionModal from "../../master/decisionmodal/DecisionModal";
import BulkUser from "./BulkUser";
import TableContainer from "../../master/table/TableContainer";
export const User = () => {
  const navigate = useNavigate();

  let { data, setData, error, setError, loading, setLoading } = useApiCall(() =>
    get("/user")
  );

  const [isReloadData, setisReloadData] = useState(false);
  const [deleteRecordId, setdeleteRecordId] = useState(null);



  useEffect(() => {
    return () => {
      setdeleteRecordId(null);
    }
  }, [])

  //Reload Data on isReloadData is true
  useEffect(() => {
    if (isReloadData) {
      get("/user")
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
    console.log(id);
    del("/user", id)
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

  const columns = useMemo(() => [
    {
      Header: "User",
      columns: [
        {
          Header: "Id",
          accessor: "id"
        }, {
          Header: "Username",
          accessor: "name"
        },
        {
          Header: "Surname",
          accessor: "surname"
        }, {
          Header: "Village",
          accessor: "village"
        },
        {
          Header: "UserType",
          accessor: "userType"
        }, {
          Header: "Action",
          Cell: (props) => {
            return (
              <td aria-colindex="5" data-label="Actions" role="cell">
                <div className="action-btns">
                  <button
                    title="User Details"
                    className="btn btn-sm btn-success"
                    onClick={() => {
                      navigate(`/admin/user/details/${props.id}`)
                    }}
                  >
                    <BiSolidUserDetail
                      fill="#fff"
                      size={"2.5rem"}
                      className="m-1"
                    />
                  </button>
                  <button
                    title="Edit"
                    className="btn btn-sm btn-primary btn-edit"
                    onClick={() => {
                      // dispatch({type : ActionTypes.SET_USER, payload : user})
                      navigate(`/admin/users/edit/${props.id}`)
                      // navigate("edit")
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
                      setdeleteRecordId(props.id);
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
            )
          }
        },
      ]
    }
  ])


  return (
    <div className="users content">
      <div className="content-header d-flex flex-row justify-content-between align-items-center">
        <h3 className="fs-1">User</h3>

        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item fs-3">
              <Link to="/admin">Dashboard</Link>
            </li>
            <li className="breadcrumb-item active fs-3  " aria-current="page">
              User
            </li>
          </ol>
        </nav>
      </div>

      <div className="card content-main">
        <div className="card-header content-title">
          <h4>User</h4>
          <span className="pull-right">
            <button
              onClick={() => {
                navigate("create");
              }}
            >
              Add New
            </button>
          </span>
        </div>

        <div className="card-body content-body">

          <BulkUser setisReloadData={setisReloadData} />

          {data && data.status === 1 ? (
            <TableContainer columns={columns} data={data.data} />
          ) : (
            <>loading</>
          )}


          {/* {data && data.status === 1 ? (
            <div className="table-responsive mt-5">
              <table
                role="table"
                aria-busy="false"
                aria-colcount="3"
                className="table b-table table-bordered table-sm b-table-stacked-md"
              >
                <thead role="rowgroup" className="">
                  <tr role="row" className="">
                    <th
                      className="position-relative text-center"
                      role="columnheader"
                      scope="col"
                      tabIndex="0"
                      aria-colindex="1"
                      aria-sort="none"
                    >
                      <div>ID</div>
                    </th>

                    <th
                      className="position-relative text-center"
                      role="columnheader"
                      scope="col"
                      tabIndex="0"
                      aria-colindex="2"
                      aria-sort="none"
                    >
                      <div>Username</div>
                    </th>

                    <th
                      className="position-relative text-center"
                      role="columnheader"
                      scope="col"
                      tabIndex="0"
                      aria-colindex="3"
                      aria-sort="none"
                    >
                      <div>Surname</div>
                    </th>

                    <th
                      className="position-relative text-center"
                      role="columnheader"
                      scope="col"
                      tabIndex="0"
                      aria-colindex="3"
                      aria-sort="none"
                    >
                      <div>Village</div>
                    </th>

                    <th
                      className="position-relative text-center"
                      role="columnheader"
                      scope="col"
                      tabIndex="0"
                      aria-colindex="4"
                      aria-sort="none"
                    >
                      <div>UserType</div>
                    </th>

                    <th
                      className="position-relative"
                      role="columnheader"
                      scope="col"
                      tabIndex="0"
                      aria-colindex="5"
                      aria-sort="none"
                    >
                      <div>Action</div>
                    </th>
                  </tr>
                </thead>

                <tbody role="rowgroup">
                  {data.data.map((user, index) => (
                    <tr role="row" aria-rowindex="1" className="" key={index}>
                      <td
                        aria-colindex="1"
                        data-label="ID"
                        role="cell"
                        className="text-center"
                      >
                        <div>{index + 1}</div>
                      </td>

                      <td className="text-center">{user.name}</td>

                      <td className="text-center">{user.surname}</td>

                      <td className="text-center">{user.village}</td>

                      <td className="text-center">{user.userType}</td>
                      <td aria-colindex="5" data-label="Actions" role="cell">
                        <div className="action-btns">
                          <button
                            title="User Details"
                            className="btn btn-sm btn-success"
                            onClick={() => {
                              navigate(`/admin/user/details/${user.id}`)
                            }}
                          >
                            <BiSolidUserDetail
                              fill="#fff"
                              size={"2.5rem"}
                              className="m-1"
                            />
                          </button>
                          <button
                            title="Edit"
                            className="btn btn-sm btn-primary btn-edit"
                            onClick={() => {
                              // dispatch({type : ActionTypes.SET_USER, payload : user})
                              navigate(`/admin/users/edit/${user.id}`)
                              // navigate("edit")
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
                              setdeleteRecordId(user.id);
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
          )} */}
        </div>
      </div>
      <DecisionModal onYes={() => {
        handleDelete(deleteRecordId)
      }} deleteRecordId={deleteRecordId} setdeleteRecordId={setdeleteRecordId} topic="Delete User" message="Are you sure you want to delete this User?" />

    </div>
  );
};

export default User;
