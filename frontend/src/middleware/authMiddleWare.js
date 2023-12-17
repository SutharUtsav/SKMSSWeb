export const authMiddleWare = () => {
    let cookie;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; token=`);
    if (parts.length === 2){
      cookie = parts.pop().split(';').shift();
    }

    if(cookie){
        return true;

    }
    return false;
}

