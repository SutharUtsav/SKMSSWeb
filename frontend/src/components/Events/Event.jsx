import React from "react";
import "./Events.css";
import { Link } from "react-router-dom";
import EventImg from "../../images/event.jpg";

const Event = () => {
  return (
    <section className="events-list-section">
      <div className="container">
        <div className="events-page-heading-container">
          <div className="container events-page-heading">
            <h5>Social Gettogether at Samajwadi</h5>
            <div className="">
              <Link to="/">Home / </Link>
              <Link to="/events">Events</Link>
              <span> / Social Gettogether</span>
            </div>
          </div>
        </div>

        <div className="event-wrapper">
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
                casual social gathering. The word get-together came into use at
                the beginning of the twentieth century. Remember, the verb
                phrase get together is never hyphenated, the noun form
                get-together is always hyphenated.
              </p>
            </div>

            <div className="image-wrapper">
              
                <div className="image-container shadow">
                  <img src={EventImg} alt="event" />
                </div>
                <div className="image-container shadow">
                  <img src={EventImg} alt="event" />
                </div>
                <div className="image-container shadow">
                  <img src={EventImg} alt="event" />
                </div>
               
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Event;
