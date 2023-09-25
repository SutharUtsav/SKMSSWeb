import React from 'react'
import EventImg from '../../images/event.jpg'

const EventContainer = () => {
    return (
        <section className='event-section'>
            <div className='container'>
                <h4>Events</h4>

                <div className='event-container'>
                    <h6>2023</h6>
                    <div className='event'>
                        <div className='image-container'>
                            <img src={EventImg} alt='event' />
                        </div>
                        <div>
                            <h5 className='event-title'>Social Gettogether at Samajwadi</h5>
                            <p className='event-description'>
                            The hyphenated term, get-together, is a noun that describes a casual social gathering. The word get-together came into use at the beginning of the twentieth century. Remember, the verb phrase get together is never hyphenated, the noun form get-together is always hyphenated.
                            </p>
                        </div>
                        <div className='date'>
                            <span>1</span>
                            <span>JUN</span>
                        </div>
                    </div>

                    <div className='event'>
                        <div className='image-container'>
                            <img src={EventImg} alt='event' />
                        </div>
                        <div>
                            <h5 className='event-title'>Social Gettogether at Samajwadi</h5>
                            <p className='event-description'>
                            The hyphenated term, get-together, is a noun that describes a casual social gathering. The word get-together came into use at the beginning of the twentieth century. Remember, the verb phrase get together is never hyphenated, the noun form get-together is always hyphenated.
                            </p>
                        </div>
                        <div className='date'>
                            <span>1</span>
                            <span>JUN</span>
                        </div>
                    </div>

                    <div className='event'>
                        <div className='image-container'>
                            <img src={EventImg} alt='event' />
                        </div>
                        <div>
                            <h5 className='event-title'>Social Gettogether at Samajwadi</h5>
                            <p className='event-description'>
                            The hyphenated term, get-together, is a noun that describes a casual social gathering. The word get-together came into use at the beginning of the twentieth century. Remember, the verb phrase get together is never hyphenated, the noun form get-together is always hyphenated.
                            </p>
                        </div>
                        <div className='date'>
                            <span>1</span>
                            <span>JUN</span>
                        </div>
                    </div>


                </div>

            </div>

        </section>
    )
}

export default EventContainer
