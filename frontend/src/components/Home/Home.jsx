import React from 'react'
import './Home.css'
import ActivityContainer from './ActivityContainer'
import EventContainer from './EventContainer'
import HeroContainer from './HeroContainer'
import Advertizement from './Advertizement'
import GalleryContainer from './GalleryContainer'

const Home = () => {


    return (
        <>
            <HeroContainer />
            <ActivityContainer />
            <EventContainer />
            <Advertizement />
            <GalleryContainer />
        </>
    )
}

export default Home
