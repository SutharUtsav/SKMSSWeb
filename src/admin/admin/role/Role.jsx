import React from 'react'
import { Link } from 'react-router-dom'
import './Role.css'
export const Role = () => {
    return (
        <div className='roles content'>
            <div className='content-header d-flex flex-row justify-content-between align-items-center'>
                <h3 className='fs-1'>Role</h3>

                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item fs-3"><Link to="/admin" >Dashboard</Link></li>
                        <li class="breadcrumb-item active fs-3  " aria-current="page" >Role</li>
                    </ol>
                </nav>

            </div>
            <div className='content-main'>
                    
            </div>
        </div>
    )
}
