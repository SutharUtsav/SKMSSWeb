import React from "react";
import { Header } from "../header/Header";
import { Footer } from "../footer/Footer";
import { Route, Routes } from "react-router-dom";
import { Dashboard } from "../dashboard/Dashboard";
import { Sidebar } from "../sidebar/Sidebar";
import User from "../../admin/user/User";
import './Home.css'
export const HomeAdmin = () => {
  return (
    <div className="admin-panel d-flex">
        <Sidebar />
      <div className="layout-wrapper ">
        <Header />

        <div className="data-wrapper py-3">
          <Routes>
            <Route path="/" element={<Dashboard />}></Route>
            <Route path="/user" element={<User />}></Route>
          </Routes>
        </div>

        <Footer />
      </div>
    </div>
  );
};
