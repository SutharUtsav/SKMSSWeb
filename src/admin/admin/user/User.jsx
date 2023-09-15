import React from 'react'
import { Link } from 'react-router-dom'

export const User = () => {
  return (
    <div className='users content'>
            <div className='content-header d-flex flex-row justify-content-between align-items-center'>
                <h3 className='fs-1'>User</h3>

                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item fs-3"><Link to="/admin" >Dashboard</Link></li>
                        <li class="breadcrumb-item active fs-3  " aria-current="page" >User</li>
                    </ol>
                </nav>

            </div>

            <div>
              
            </div>
        </div>
  )
}

export default User