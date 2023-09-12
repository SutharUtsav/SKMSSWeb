import React from 'react'
import logo from '../../../icons/SamajLogo.png'
import './Sidebar.css'
import { NavLink } from 'react-router-dom'
export const Sidebar = () => {
  return (
    <div className='sidebar flex-column flex-shrink-0 p-3 bg-light' >
      <a href='/' className='d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none'>
        <div className='logo'>
          <img src={logo} alt="logo" />
          <span className='fs-4'>શ્રી કચ્છ મેવાડા સુથાર સમાજ ટ્રસ્ટ-સુખપર</span>
        </div>

      </a>
      <hr />
      <ul className="nav nav-pills flex-column mb-auto">
        <li className='nav-item'>
          <NavLink end to='/admin' className='nav-link link-dark'>Dashboard</NavLink>
        </li>


        <li>
          <NavLink end to='/admin/user' className='nav-link link-dark'>
            User
          </NavLink>
        </li>
      </ul>
    </div>
  )
}
