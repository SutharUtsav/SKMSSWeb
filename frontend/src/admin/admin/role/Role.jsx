import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './Role.css'
import '../Common.css'
import { useApiCall } from "../../../hooks/useApiCall";
import { get } from '../../../service/api-service';

export const Role = () => {

    const { data, error } = useApiCall(() => get("/role"));

    const [roles, setRoles] = useState(null)


    useEffect(() => {        
        if(data && data.status === 1){
            setRoles(data.data)
        }
        else{

        }
        console.log(data)
    }, [data,error]);

    return (
        <div className='roles content'>
            <div className='content-header d-flex flex-row justify-content-between align-items-center'>
                <h3 className='fs-1'>Role</h3>

                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item fs-3"><Link to="/admin" >Dashboard</Link></li>
                        <li className="breadcrumb-item active fs-3  " aria-current="page" >Role</li>
                    </ol>
                </nav>

            </div>
            <div className='card content-main'>
                <div className='card-header content-title'>
                    <h4>Role</h4>
                    <span className="pull-right">
                        <button>Add New</button>

                    </span>
                </div>

                <div className='card-body content-body'>
                    <div className="row mb-2">
                        <div className='input-search col-md-3 offset-md-8'>
                            <h4 className='box-title'>Search</h4>
                            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                        </div>
                        <div className="text-center col-md-1">
                            <button className="btn btn-refresh" type="submit">
                                <i className="fa fa-refresh" aria-hidden="true"></i>
                            </button>
                        </div>
                    </div>

                    {roles ? (
                        <div className="table-reponsive mt-5">
                            <table role='table' aria-busy='false' aria-colcount={3} className='table b-table table-bordered table-sm b-table-stacked-md'>
                                <thead role='rowgroup' className=''>
                                    <tr role='row' className=''>
                                        <th className="position-relative text-center" role='columnheader' scope='col' tabIndex={0} aria-colindex='1' aria-sort="none">
                                            <div>ID</div>
                                            {/* <span className='sr-only'> (Click to sort ascending) </span> */}
                                        </th>

                                        <th className="position-relative text-center" role='columnheader' scope='col' tabIndex={0} aria-colindex='2' aria-sort="none">
                                            <div>Name</div>
                                            {/* <span className='sr-only'> (Click to sort ascending) </span> */}
                                        </th>

                                        <th className="position-relative text-center" role='columnheader' scope='col' tabIndex={0} aria-colindex='3' aria-sort="none">
                                            <div>Description</div>
                                            {/* <span className='sr-only'> (Click to sort ascending) </span> */}
                                        </th>

                                        <th className="position-relative text-center" role='columnheader' scope='col' tabIndex={0} aria-colindex='4' aria-sort="none">
                                            <div>RoleType</div>
                                            {/* <span className='sr-only'> (Click to sort ascending) </span> */}
                                        </th>

                                        <th className="position-relative" role='columnheader' scope='col' tabIndex={0} aria-colindex='5' aria-sort="none">
                                            <div>Action</div>
                                            {/* <span className='sr-only'> (Click to sort ascending) </span> */}
                                        </th>
                                    </tr>
                                </thead>

                                <tbody role='rowgroup'>
                                    <tr role='row' aria-rowindex="1" className=''>
                                        <td aria-colindex="1" data-label="ID" role="cell" className='text-center'>
                                            <div>1</div>
                                        </td>

                                        <td></td>

                                        <td></td>

                                        <td></td>

                                        <td aria-colindex="5" data-label="Actions" role="cell">
                                            <div className='action-btns'>
                                                <button title='Edit' className='btn btn-sm btn-primary btn-edit'>Edit</button>
                                                <button title='Delete' className='btn btn-sm btn-danger btn-delete'>Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    ) : null}

                </div>

            </div>
        </div>
    )
}
