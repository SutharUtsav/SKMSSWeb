import React from 'react'
import GalleryInfrastructure from '../../images/gallery-infrastructure.jpg'
import GalleryEvent from '../../images/gallery-event.jpg'
import GalleryActivity from '../../images/gallery-activity.jpg'

const GalleryContainer = () => {
    return (
        <section className='gallery-section'>
            <div className='container'>
                <h4>Gallery</h4>

                <div className='gallery-container'>
                    <div className='image-container shadow'>
                        <img src={GalleryInfrastructure} alt="gallery" />
                    </div>

                    <div className='image-container shadow'>
                        <img src={GalleryEvent} alt="gallery" />
                    </div>

                    <div className='image-container shadow'>
                        <img src={GalleryActivity} alt="gallery" />
                    </div>


                </div>
            </div>
        </section>
    )
}

export default GalleryContainer
