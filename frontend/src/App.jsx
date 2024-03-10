import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/shared/Header/Header";
import Navbar from "./components/shared/Navbar/Navbar";
import Home from "./components/Home/Home";
import Footer from "./components/shared/Footer/Footer";
import Events from "./components/Events/Events";
import Trustees from "./components/Trustees/Trustees";
import Event from "./components/Events/Event";
import NotFound from "./components/NotFound/NotFound";
import Contact from "./components/contact/Contact";
import { HomeAdmin } from "./admin/master/home/Home";
import Login from "./components/Login/Login";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authMiddleWare, getAuthUser } from "./middleware/authMiddleWare";
import { ActionTypes } from "./redux/action-type";

const Layout = (Component) => {
  return (
    <>
      <Header />
      <Navbar />

      <Component.Component />
      <Footer />
    </>
  );
};

function App() {
  let authUser = useSelector((data) => data.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!authUser.user && authMiddleWare()) {
      const user = getAuthUser();
      if (user) {
        dispatch({type: ActionTypes.SET_AUTH_USER, payload: {
          roleId: user.roleId,
          name: user.name,
          roleName: user.role,
          userType: user.userType,
          userImage: user.userImage
        }})
      }
    }
  }, [authUser]);

  return (
    <BrowserRouter>
      {/* <div>
        <Header />
        <Navbar />
      </div> */}

      <Routes>
        <Route path="/" exact={true} element={<Layout Component={Home} />} />
        <Route path="/events" element={<Layout Component={Events} />}></Route>
        <Route path="/activity/:activityCategory" element={<Layout Component={Events}/>}></Route>
        <Route
          path="/events/:id"
          element={<Layout Component={Event} />}
        ></Route>
        <Route
          path="/trustees"
          element={<Layout Component={Trustees} />}
        ></Route>
        <Route path="/contact" element={<Layout Component={Contact} />}></Route>
        <Route path="/admin/*" element={<HomeAdmin />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="*" element={<Layout Component={NotFound} />}></Route>
      </Routes>

      {/* <Footer /> */}
    </BrowserRouter>
  );
}

export default App;
