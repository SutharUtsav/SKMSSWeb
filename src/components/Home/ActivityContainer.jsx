import React from 'react'
import Social from '../../icons/social-activity-logo.jpg'
import Educational from '../../icons/educational-activity-logo.png'
import Fun from '../../icons/fun-activity-logo.webp'
import { useNavigate } from 'react-router-dom'

const ActivityContainer = () => {

    const navigate = useNavigate();

    return (
        <section className='activity-category'>
            <div className='container activity-container'>
                <div className='activity col-12 col-sm-10 col-md-4' onClick={()=>{navigate("/events")}}>
                    <div className='logo-container'>
                        <img src={Social} alt='Social Activity'></img>
                    </div>
                    <h4>Social Activity</h4>
                    <p>Social activity is a event or pursuit that brings members of the community together.</p>

                </div>

                <div className='activity col-12 col-sm-10 col-md-4 ' onClick={()=>{navigate("/events")}}>
                    <div className='logo-container'>
                        <img src={Educational} alt='Educational Activity'></img>
                    </div>
                    <h4>Educational Activity</h4>
                    <p> Educational activity is the activities of educating or instructing; activities that impart knowledge or skill. </p>
                </div>

                <div className='activity col-12 col-sm-10 col-md-4 ' onClick={()=>{navigate("/events")}}>
                    <div className='logo-container'>
                        <img src={Fun} alt='Other Activity'></img>
                    </div>

                    <h4>Other Activity</h4>
                    <p>Social activity is a event or pursuit that brings members of the community together.</p>
                </div>
            </div>
        </section>
    )
}

export default ActivityContainer
