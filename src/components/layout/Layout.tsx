import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "../../styles/adminLayout.css";
import Breadcrumbs from "../BreadCrumps";


type MenuItem = {
  label: string;
  path: string;
};

type LayoutProps = {
  sidebarTitle: string;
  topbarTitle: string;
  menuItems: MenuItem[];
};

function ReusableLayout({
  sidebarTitle,
  topbarTitle,
  menuItems,
}: LayoutProps) {
  return (
    <div className="admin-layout">
      <Sidebar title={sidebarTitle} items={menuItems} />

      <div className="admin-main">
        <Topbar title={topbarTitle} />

        <main className="admin-content">
          <Breadcrumbs/>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default ReusableLayout;