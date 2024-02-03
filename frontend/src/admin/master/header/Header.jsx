import React from "react";
import Profile from "../../../images/profile.jpg";
import "./Header.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { ActionTypes } from "../../../redux/action-type";
import { useNavigate } from "react-router-dom";

export const Header = () => {

  let authUser = useSelector((data) => data.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {

  }, [authUser])


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
          <img className="avatar" src={authUser.user?.userImage ? authUser.user.userImage : Profile} alt="profile-img" />
          <span className="fs-4">Admin</span>
        </button>
        <ul className="dropdown-menu profile-dropdown" aria-labelledby="profileDropdownMenuButton">
          <li>
            <a className="dropdown-item" href="/">
              View Profile
            </a>
          </li>
          <li className="border-top">
            <button className="dropdown-item" onClick={() => {
              document.cookie = 'token=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
              dispatch({ type: ActionTypes.SET_AUTH_USER, payload: null });
              navigate("/");
            }}>Logout</button>
          </li>
        </ul>
      </div>
    </div>
  );
};
