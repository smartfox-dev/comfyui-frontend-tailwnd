import { Outlet, useLocation } from "react-router-dom";
import React from 'react';
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar"; // Import your Sidebar component
import Footer from "../components/Footer";

export default function Withnavbar() {
  const location = useLocation();
  const { pathname } = location;
  
  return (
  <>
    <Navbar className={`${pathname === '/' ? 'snap-start' : ''} md:snap-align-none grow-0`} />
    <div className={`flex flex-row h-screen overflow-hidden`}>
      <Sidebar />
      <div className={`flex flex-col flex-auto h-full ${pathname === "/" ? 'snap-y snap-mandatory' : ''}`}>
        <div className="flex flex-auto">
          <Outlet />
        </div>
      </div>
    </div>
  </>
  );
}