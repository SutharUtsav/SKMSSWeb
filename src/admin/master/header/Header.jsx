import React from "react";
import Profile from '../../../images/profile.jpg' 
import './Header.css'

export const Header = () => {
  return (
  <div className="header">

    <div className="profile">
      <img className="avatar" src={Profile} alt="profile-picture"/>
      <span>Utsav Suthar</span>
    </div>

  </div>
  );
};
