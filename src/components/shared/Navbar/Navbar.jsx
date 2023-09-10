import React from 'react'
import './Navbar.css'
import { Link, NavLink } from 'react-router-dom'


const Navbar = (props) => {

  return (
    <nav className='navbar'>
      <div className='container navbar-container'>

        <div className='links'>
          <div><NavLink to='/'>Home</NavLink></div>
          <div><NavLink to='/events'>Events</NavLink></div>
          <div className='hide-mobile'><NavLink to='/trustees'>Trustees</NavLink></div>
          <div className='hide-mobile'><NavLink to='/infrastructure'>Infrastructure</NavLink></div>
          <div className='hide-mobile'><NavLink to='/gallery'>Gallery</NavLink></div>
          <div className='hide-mobile'><NavLink to='/login'>Login</NavLink></div>
          <div className="dropdown more-links hide-desktop">
            <button className="dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
              More Pages
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
              <li><Link className="dropdown-item text-dark" to='/trustees'>Trustees</Link></li>
              <li><Link className="dropdown-item text-dark" to='/infrastructure'>Infrastructure</Link></li>
              <li><Link className="dropdown-item text-dark" to='/gallery'>Gallery</Link></li>
              <li><Link className="dropdown-item text-dark" to='/'>About Us</Link></li>
              <li><Link className="dropdown-item text-dark" to='/'>Contact Us</Link></li>
            </ul>
          </div>



        </div>

      </div>


    </nav>
  )
}

export default Navbar
