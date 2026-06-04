import Layout from "./Layout";
import { doctorMenu } from "./Menu";


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