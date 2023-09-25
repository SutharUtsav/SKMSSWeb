import React from "react";
import Profile from "../../../images/profile.jpg";
import "./Header.css";

export const Header = () => {
  return (
    <div className="header py-1 px-4">
      <div className="dropdown profile  py-3 px-4 align-items-center">
        <button
          className="d-flex align-items-center dropdown-toggle"
          type="button"
          id="profileDropdownMenuButton"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <img className="avatar" src={Profile} alt="profile-img" />
          <span className="fs-4">Admin</span>
        </button>
        <ul class="dropdown-menu profile-dropdown" aria-labelledby="profileDropdownMenuButton">
          <li>
            <a className="dropdown-item" href="/">
              View Profile
            </a>
          </li>
          <li className="border-top">
            <a class="dropdown-item" href="/">
              Logout
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};
