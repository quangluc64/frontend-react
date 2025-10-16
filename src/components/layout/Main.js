import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";

const Main = () => {
  return (
    <div className="grid grid-cols-[288px_minmax(0,1fr)] gap-8 min-h-screen bg-gray-50">
      <div className="sidebar">
        <SideBar />
      </div>
      <div className="main-content py-5">
        <Outlet />
      </div>
    </div>
  );
};

export default Main;
