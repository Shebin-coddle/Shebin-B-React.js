import Layout from "./Layout";
import { doctorMenu } from "../Labels/Menu";

function DoctorLayout() {
  return (
    <Layout
      sidebarTitle="Doctor Portal"
      topbarTitle="Doctor Panel"
      menuItems={doctorMenu}
    />
  );
}

export default DoctorLayout;
