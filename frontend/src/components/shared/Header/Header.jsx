import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Header.css'
import whatsappLogo from '../../../icons/whatsapp-logo.png'
import emailLogo from '../../../icons/email-logo.png'
import logo from '../../../icons/SamajLogo.png'
import { useSelector } from 'react-redux'

const Header = (props) => {

  const navigate = useNavigate();
  const authUser = useSelector(data => data.user);

  console.log(authUser)

  return (
    <>
      <section className='top-nav hide-mobile'>
        <div className='container d-flex justify-content-between'>
          <div className='links'>
            <Link to='/about'>About Us</Link>
            <Link to='/contact'>Contact Us</Link>
          </div>

          <div className='languages'>
            <span>Gujarati</span>
            <span>English</span>
          </div>
        </div>
      </section>


      <header className='header'>
        <div className='container header-container'>

          <div className='logo my-auto'>
            <img src={logo} alt="logo" />
            <h1>શ્રી કચ્છ મેવાડા સુથાર સમાજ ટ્રસ્ટ-સુખપર</h1>
          </div>


          <div className='hide-desktop'>
            <button className='login-btn shadow'>Login</button>
          </div>

          <div className='hide-mobile'>
            <div className='contact-details'>
              <div className='email d-flex align-items-center'>
                <div className='icon-img'>
                  <img src={emailLogo} alt='email-icon'></img>
                </div>
                <div className='d-flex flex-column'>
                  <span className='title'>EMAIL</span>
                  <span className='value'>kutchmevadasutharsukhpar@gmail.com</span>
                </div>
              </div>
              <div className='whatsapp d-flex align-items-center'>
                <div className='icon-img'>
                  <img src={whatsappLogo} alt='whatsapp-icon'></img>
                </div>
                <div className='d-flex flex-column'>
                  <span className='title'>WHATSAPP</span>
                  <span className='value'>+911234567890</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}

export default Header
