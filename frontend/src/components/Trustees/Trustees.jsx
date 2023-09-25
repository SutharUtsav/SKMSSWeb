import React from "react";
import { Link } from "react-router-dom";
import "./Trustees.css";

const Trustees = () => {
  return (
    <section className="trustees-list-section">
      <div className="container">
        <div className="trustees-page-heading-container">
          <div className="container trustees-page-heading">
            <h5>Trustees</h5>
            <div className="">
              <Link to="/">Home</Link>
              <span> / Trustees</span>
            </div>
          </div>
        </div>

        <div className="trustees-container">
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">No.</th>
                <th scope="col">Full Name</th>
                <th scope="col">Contact No.</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">1</th>
                <td>Suthar Abc Xyz</td>
                <td>+91 1234567890</td>
              </tr>
              <tr>
                <th scope="row">2</th>
                <td>Suthar Abc Xyz</td>
                <td>+91 1234567890</td>
              </tr>
              <tr>
                <th scope="row">3</th>
                <td>Suthar Abc Xyz</td>
                <td>+91 1234567890</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default Trustees;
