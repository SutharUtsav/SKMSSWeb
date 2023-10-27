import React from "react";
import { Header } from "../header/Header";
import { Footer } from "../footer/Footer";
import { Route, Routes } from "react-router-dom";
import { Dashboard } from "../dashboard/Dashboard";
import { Sidebar } from "../sidebar/Sidebar";
import User from "../../admin/user/User";
import './Home.css'
import {Role} from "../../admin/role/Role";
import Family from "../../admin/family/Family";
import Permission from "../../admin/permission/Permission";
import UserForm from "../../admin/user/UserForm";
import UserDetails from "../../admin/user/UserDetails";
import FamilyForm from "../../admin/family/FamilyForm";
export const HomeAdmin = () => {
  return (
    <div className="admin-panel d-flex">
        <Sidebar />
      <div className="layout-wrapper ">
        <Header />

        <div className="data-wrapper py-3">
          <Routes>
            <Route path="/" element={<Dashboard />}></Route>
            <Route path="/users" element={<User />}></Route>
            <Route path="/users/create" element={<UserForm />}></Route>
            <Route path="/users/edit/:id" element={<UserForm/>}></Route>
            <Route path="/user/details/:id" element={<UserDetails/>}></Route>
            <Route path="/roles" element={<Role/>}></Route>
            <Route path="/permissions" element={<Permission/>}></Route>
            <Route path="/families" element={<Family/>}></Route>
            <Route path="/families/create" element={<FamilyForm/>}></Route>
            <Route path="/families/edit/:id" element={<FamilyForm/>}></Route>
          </Routes>
        </div>

        <Footer />
      </div>
    </div>
  );
};
