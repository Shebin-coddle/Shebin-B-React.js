
import Layout from "./Layout";
import { nurseMenu } from "./Menu";

function NurseLayout() {
  return (
    <Layout
       sidebarTitle="Nurse Portal"
      topbarTitle="Nurse Panel"
      menuItems={nurseMenu}
    />
  );
}

export default NurseLayout;