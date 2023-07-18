import React from "react";
import "./Events.css";
import EventImg from "../../images/event.jpg";
import { Link, useNavigate } from "react-router-dom";

const Events = () => {

  const navigate =  useNavigate();

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
            {/* Event1 */}
            <div className="d-flex flex-column event" onClick={()=>{
              navigate('/events/1')
            }}>
              <div className="image-date-wrapper">
                <div className="date-container">
                  <div className="d-flex flex-column">
                    <span>1</span>
                    <span>Jun 2023</span>
                  </div>
                </div>
                <div className="main-image-container shadow">
                  <img src={EventImg} alt="event" />
                </div>
              </div>
              <div className="event-desc">
                <h5 className="event-title">Social Gettogether at Samajwadi</h5>
                <p className="event-description">
                  The hyphenated term, get-together, is a noun that describes a
                  casual social gathering. The word get-together came into use
                  at the beginning of the twentieth century. Remember, the verb
                  phrase get together is never hyphenated, the noun form
                  get-together is always hyphenated.
                </p>
              </div>
            </div>

            {/* Event 2 */}
            <div className="d-flex flex-column event">
              <div className="image-date-wrapper">
                <div className="date-container">
                  <div className="d-flex flex-column">
                    <span>1</span>
                    <span>Jun 2023</span>
                  </div>
                </div>
                <div className="main-image-container shadow">
                  <img src={EventImg} alt="event" />
                </div>
              </div>
              <div className="event-desc">
                <h5 className="event-title">Social Gettogether at Samajwadi</h5>
                <p className="event-description">
                  The hyphenated term, get-together, is a noun that describes a
                  casual social gathering. The word get-together came into use
                  at the beginning of the twentieth century. Remember, the verb
                  phrase get together is never hyphenated, the noun form
                  get-together is always hyphenated.
                </p>
              </div>
            </div>
          </div>

          <div className="event-page-sidenav-container">
            <div className="upcoming-events-container">
              <h5 className="heading">Upcoming Events</h5>
              <div className="event">
                <div className="image-container">
                  <img src={EventImg} alt="upcoming-event" />
                </div>
                <div className="details">
                  <span className="date">12 July, 2023</span>
                  <span className="title">Sneh Milan 2023</span>
                </div>
              </div>

              <div className="event">
                <div className="image-container">
                  <img src={EventImg} alt="upcoming-event" />
                </div>
                <div className="details">
                  <span className="date">12 July, 2023</span>
                  <span className="title">Sneh Milan 2023</span>
                </div>
              </div>
            </div>
            {/* <div className="events-archive-container">
              <div className="archive-events-container">

              </div>
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Events;
