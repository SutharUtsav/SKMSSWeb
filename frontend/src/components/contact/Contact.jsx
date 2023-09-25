import React from "react";
import { Link } from "react-router-dom";
import "./Contact.css";

const Contact = () => {
  return (
    <section className="contact-section">
      <div className="container">
        <div className="contact-page-heading-container">
          <div className="container contact-page-heading">
            <h5>Contact</h5>
            <div className="">
              <Link to="/">Home</Link>
              <span> / Contact</span>
            </div>
          </div>
        </div>
        <div className="contact-container">
          <div className="map-container">
            <iframe title="map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7333.577213921992!2d69.61058237770996!3d23.214373300000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39511ef7b6b84ae9%3A0x6b0c75d7ea185636!2sShree%20Kutchi%20Mevada%20Suthar%20Samajwadi!5e0!3m2!1sen!2sin!4v1689516424387!5m2!1sen!2sin"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          <div>

            <p>
              Address: Shree Kutch Mevada Suthar Samajwadi, Sukhpar, Bhuj,
              Gujarat 370040
            </p>
            <p className="mobile">
              Mobile: <span>+911234567890</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
