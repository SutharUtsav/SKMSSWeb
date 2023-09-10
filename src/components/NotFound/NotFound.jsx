import React from 'react'
import { Link } from 'react-router-dom'
import './NotFound.css'
const NotFound = () => {
  return (
    <section className='page-not-found-section'>
        <div>
            <h2>404</h2>
            <h6>Page Not Found</h6>
            <span> Go to <Link to='/'>Home</Link></span>
        </div>
    </section>
  )
}

export default NotFound