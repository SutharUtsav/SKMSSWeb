import React from 'react'
import './Footer.css'
import { useState, useEffect } from 'react'
import {Link} from 'react-router-dom'

const Footer = () => {

  const [today, settoday] = useState(new Date())

  useEffect(() => {
    settoday(new Date())
  }, [])

  return (
    <footer className='footer'>
      <div className="container footer-container">
        <div className='footer-section'>
          <h3>Contact Us</h3>
          <p>Address: Shree Kutch Mevada Suthar Samajwadi, Sukhpar, Bhuj, Gujarat 370040</p>
          <p className='mobile'>Mobile: <span>+911234567890</span></p>
        </div>
        <div className='footer-section'>
          <h3>Pages</h3>
          <Link to='/about'>About Us</Link>
          <Link to='/events'>Events</Link>
          <Link to='/infrastructure'>Infrastructure</Link>
          <Link to='/contact'>Contact us</Link>

        </div>
        <div className='footer-section'>
          <h3>About Us</h3>
          <p>
            Lorem ipsum is typically a corrupted version of De finibus bonorum et malorum, a 1st-century BC text by the Roman statesman and philosopher Cicero, with words altered, added, and removed to make it nonsensical and improper Latin. The first two words themselves are a truncation of 'dolorem ipsum'
          </p>
        </div>
      </div>
      <div className='bottom-footer'>
        <p>&copy; {today.getFullYear()} Shree Kutchi Mevada Suthar Samaj Sukhpar</p>
      </div>
    </footer>
  )
}

export default Footer
