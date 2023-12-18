import React from 'react'
import './Navbar.css'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { ActionTypes } from '../../../redux/action-type';


const Navbar = (props) => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authUser = useSelector(data => data.user);

  return (
    <nav className='navbar'>
      <div className='container navbar-container'>

        <div className='links'>
          <div><NavLink to='/'>Home</NavLink></div>
          <div><NavLink to='/events'>Events</NavLink></div>
          <div className='hide-mobile'><NavLink to='/trustees'>Trustees</NavLink></div>
          <div className='hide-mobile'><NavLink to='/infrastructure'>Infrastructure</NavLink></div>
          <div className='hide-mobile'><NavLink to='/gallery'>Gallery</NavLink></div>
          <div className='hide-mobile'>
            {authUser.user 
            ? <button onClick={()=>{
              document.cookie = 'token=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                dispatch({type: ActionTypes.SET_AUTH_USER, payload: null});
            }}>Logout</button> 
            :<NavLink to='/login'>Login</NavLink>
            }
          </div>
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
