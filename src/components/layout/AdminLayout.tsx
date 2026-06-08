import Layout from "./Layout";
import { adminMenu } from "../Labels/Menu";

function AdminLayout() {
  return (
    <Layout
      sidebarTitle="Hospital Admin"
      topbarTitle="Admin Panel"
      menuItems={adminMenu}
    />
  );
}

export default AdminLayout;
