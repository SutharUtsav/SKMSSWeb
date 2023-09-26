import React from 'react'
import { RolePermissionEntity } from '../../../consts/RolePermissioEntity'

const CreateRoleModal = () => {
    return (
        <div className="modal fade" id="createRoleModal" tabindex="-1" aria-labelledby="createRoleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="createRoleModalLabel">New Role</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div class="mb-3">
                                <label for="roleNameInput" class="form-label">Name</label>
                                <input type="text" class="form-control" id="roleNameInput" aria-describedby="roleNameInput" />
                            </div>

                            <div class="mb-3">
                                <label for="roleDescInput" class="form-label">Description</label>
                                <input type="text" class="form-control" id="roleDescInput" aria-describedby="roleDescInput" />
                            </div>

                            <div className='table-responsive'>
                                <table className='table table-lg table-bordered'>
                                    <tbody>
                                        {Object.keys(RolePermissionEntity).map((key,index)=>(
                                            <tr key={index}>
                                                <th>{key}</th>
                                                <td>
                                                    <div className='row'>
                                                        <div className='col-6 col-md-4 mb-2'>
                                                            <div className='form-check form-switch'>
                                                                <input type="checkbox" name="" id={`checkbox_${index}`} className='form-check-input' />
                                                                <label htmlFor={`checkbox_${index}`} style={{marginLeft:"5px"}}>Manage Dashboard</label>
                                                            </div>
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
    )
}

export default CreateRoleModal
