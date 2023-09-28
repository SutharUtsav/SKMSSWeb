import React from "react";
import { Link } from "react-router-dom";
import "./Role.css";
import "../Common.css";
import { get } from "../../../service/api-service";
import { BiEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { BsSearch } from "react-icons/bs";
import { BiRefresh } from "react-icons/bi";
import RoleModal from "./RoleModal";
import useApiCall from "../../../hooks/useApiCall";

export const Role = () => {
    const { data, error, loading } = useApiCall(() => get("/role"));

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
                            <button type="button" data-bs-toggle="modal" data-bs-target="#createRoleModal">Add New</button>
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
                        ) : <>loading</>}
                    </div>
                </div>
            </div>
            <RoleModal />
        </>
    );
};
