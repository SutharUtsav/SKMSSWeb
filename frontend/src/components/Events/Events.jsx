import React, { useEffect, useState } from "react";
import "./Events.css";
import EventImg from "../../images/event.jpg";
import { Link, useNavigate, useParams } from "react-router-dom";
import { get, getByQueryParams } from "../../service/api-service";
import { EnumMonths } from "../../consts/EnumMonths";

const Events = () => {

  const defaultLimit = 1; // default Limit

  const params = useParams();
  const activityCategory = params.activityCategory;
  const navigate = useNavigate();

  const [limit, setLimit] = useState(defaultLimit);

  useEffect(() => {

    const params = {
      limit,
      activityCategory
    }

    getByQueryParams('/event/recent-events', params)
      .then((response) => {
        console.log(response)
        if (response.data.status === 1) {
          setData(response.data.data)
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }, [limit, activityCategory])


  const [data, setData] = useState([]);

  return (
    <section className="events-list-section">
      <div className="container">

        <div className="events-page-heading-container">
          <div className="container events-page-heading">
            <h5>Events</h5>
            <div className="">
              <Link to="/">Home</Link>
              <span> / Events</span>
            </div>
          </div>
        </div>

        <div className="event-page-container">
          <div className="events-container">
            {/* Event List */}
            {data && data.length > 0 ? (
              <>
                {data.map((event, index) => (
                  <div key={index} className="d-flex flex-column event" onClick={() => {
                    navigate(`/events/${event.id}`)
                  }}>
                    <div className="image-date-wrapper">
                      <div className="date-container">
                        <div className="d-flex flex-column">
                          <span>{new Date(event.eventOn).getDate()}</span>
                          <span>{`${EnumMonths[new Date(event.eventOn).getMonth()]} ${new Date(event.eventOn).getFullYear()}`}</span>
                        </div>
                      </div>
                      <div className="main-image-container shadow">
                        <img src={event.images.find((image) => image.isCoverImage)?.imageURL} alt="event" />
                      </div>
                    </div>
                    <div className="event-desc">
                      <h5 className="event-title">{event.title}</h5>
                      <p className="event-description">
                        {event.description}
                      </p>
                    </div>
                  </div>
                ))}
                
                <button type="button" className="load-more-events btn btn-link fs-3" onClick={(e) => {
                  setLimit(limit + defaultLimit);
                }}>Load More...</button>
              </>
            ) : null}


          </div>

        </div>
      </div>
    </section>
  );
};

export default Events;
