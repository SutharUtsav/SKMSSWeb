import React from 'react'
import logo from '../../../icons/SamajLogo.png'
import './Sidebar.css'
import { NavLink } from 'react-router-dom'
export const Sidebar = () => {
  return (
    <div className='sidebar flex-column flex-shrink-0 py-3 px-4 bg-light shadow' >
      <a href='/' className='d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none'>
        <div className='logo'>
          <img src={logo} alt="logo" />
          <span className='fs-3'>શ્રી કચ્છ મેવાડા સુથાર સમાજ ટ્રસ્ટ-સુખપર</span>
        </div>

      </a>
      <hr />
      <ul className="nav nav-pills flex-column mb-auto">
        <li className='nav-item'>
          <NavLink end to='/admin' className='nav-link link-dark'>Dashboard</NavLink>
        </li>

        <li>
          <NavLink end to='/admin/families' className='nav-link link-dark'>
            Family
          </NavLink>
        </li>

        <li>
          <NavLink end to='/admin/users' className='nav-link link-dark'>
            User
          </NavLink>
        </li>

        <li>
          <NavLink end to='/admin/events' className='nav-link link-dark'>
            Event
          </NavLink>
        </li>

        <li>
          <NavLink end to='/admin/social-worker' className='nav-link link-dark'>
            Social Worker
          </NavLink>
        </li>

        <li>
          <NavLink end to='/admin/samajwadi-occupied' className='nav-link link-dark'>
            Samajwadi Occupied
          </NavLink>
        </li>

        <li>
          <NavLink end to='/admin/vastipatrak' className='nav-link link-dark'>
            Vasti Patrak
          </NavLink>
        </li>

        <li>
          <NavLink end to='/admin/sponsor' className='nav-link link-dark' >
            Sponsor
          </NavLink>
        </li>
        
        <li>
          <NavLink end to='/admin/gallery' className='nav-link link-dark' >
            Gallery
          </NavLink>
        </li>

        <li>
          <NavLink end to='/admin/roles' className='nav-link link-dark'>
            Role
          </NavLink>
        </li>

        <li>
          <NavLink end to='/admin/permissions' className='nav-link link-dark'>
            Permissions
          </NavLink>
        </li>
      </ul>
    </div>
  )
}
