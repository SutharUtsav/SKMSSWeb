import { jwtDecode } from "jwt-decode";

const getCookie = () =>{
  let cookie;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; token=`);
  if (parts.length === 2) {
    cookie = parts.pop().split(";").shift();
  }

  if (cookie) {
    return cookie;
  }
  return null;
}

export const authMiddleWare = () => {
  if(!getCookie()){
    return false;
  }

  return true;
};


export const authorizeAdmin = () => {
  const cookie = getCookie();

  if(!cookie)
    return false;

  const token = cookie.split(' ')[1];

  if(!token){
    return false;
  }

  const decodedToken = jwtDecode(token);

  if(!decodedToken.role){
    return false;
  }
  else if(String(decodedToken.role).toLowerCase() === "admin"){
    return true;
  }
  return false;
}


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
