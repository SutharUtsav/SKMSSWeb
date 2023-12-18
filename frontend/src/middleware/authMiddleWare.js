import { jwtDecode } from "jwt-decode";

export const authMiddleWare = () => {
  let cookie;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; token=`);
  if (parts.length === 2) {
    cookie = parts.pop().split(";").shift();
  }

  if (cookie) {
    return true;
  }
  return false;
};

export const getAuthUser = () => {
  let user = null;
  let cookie;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; token=`);
  if (parts.length === 2) {
    cookie = parts.pop().split(";").shift();
  }
  const token = cookie.split(' ')[1];
  
  if (cookie && token) {
    user = jwtDecode(token);
  }

  return user;
};
