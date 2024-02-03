import React, { useEffect, useState } from "react";
import "./Events.css";
import { Link, useParams } from "react-router-dom";
import EventImg from "../../images/event.jpg";
import { get } from "../../service/api-service";
import { EnumMonths } from "../../consts/EnumMonths";

const Event = (props) => {
  const params = useParams();
  const eventId = params.id;
  const defaultEvent = {
    title: "Social Gettogether at Samajwadi",
    description: `The hyphenated term, get-together, is a noun that describes a
    casual social gathering. The word get-together came into use at
    the beginning of the twentieth century. Remember, the verb
    phrase get together is never hyphenated, the noun form
    get-together is always hyphenated.`,
    eventDate: "1",
    eventMonth: "May",
    eventYear: "2024",
  }

  const [event, setevent] = useState(defaultEvent);
  const [eventImages, seteventImages] = useState([EventImg])
  const [eventMainImage, setEventMainImage] = useState(EventImg);

  useEffect(() => {
    if (eventId || props.relaodEvent === true) {
      get(`/event/${eventId}`)
        .then((response) => {
          if (response.data.status === 1) {
            const localEvent = response.data.data
            const eventOn = new Date(response.data.data?.eventOn);

            setevent({
              ...event,
              title: localEvent.title,
              description: localEvent.description,
              eventDate: eventOn.getDate(),
              eventMonth: EnumMonths[eventOn.getMonth()],
              eventYear: eventOn.getFullYear(),
            })

            if (localEvent.mainImageURL) {
              setEventMainImage(localEvent.mainImageURL)
            }
            console.log(localEvent.imageURLs)
            if(localEvent.imageURLs && localEvent.imageURLs.length > 0){
              
              seteventImages(localEvent.imageURLs)
            }
          }
          else {
            setevent(defaultEvent)
            seteventImages([EventImg])
            setEventMainImage(EventImg)
          }
        })
        .catch((error) => {
          console.log(error)
          setevent(defaultEvent)
          seteventImages([EventImg])
          setEventMainImage(EventImg)
        })
        .finally(()=>{
          if(props.seteventImages){
            props.seteventImages(false)
          }
        })
    }
  }, [eventId, props.relaodEvent]);


  useEffect(() => {
  console.log(eventImages.length) 
  }, [eventImages])
  return (
    <section className="events-list-section">
      <div className="container">
        <div className="events-page-heading-container">
          <div className="container events-page-heading">
            <h5>{event.title}</h5>
            <div className="">
              <Link to="/">Home / </Link>
              <Link to="/events">Events</Link>
              <span> / {event.title}</span>
            </div>
          </div>
        </div>

        <div className="event-wrapper">
          <div className="d-flex flex-column event">
            <div className="image-date-wrapper">
              <div className="date-container">
                <div className="d-flex flex-column">
                  <span>{event.eventDate}</span>
                  <span>{`${event.eventMonth} ${event.eventYear}`}</span>
                </div>
              </div>
              <div className="main-image-container shadow">
                <img src={eventMainImage} alt="event" loading="lazy" />
              </div>
            </div>

            <div className="event-desc">
              <h5 className="event-title">{event.title}</h5>
              <p className="event-description" style={{textTransform:"none"}}>
                {event.description}
              </p>
            </div>

            {eventImages && eventImages.length > 0 ? (
              <div className="image-wrapper">
                {eventImages.map((image, index) => (
                  <div className="image-container shadow" key={index}>
                    <img src={image} alt="event" />
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Event;
