import Layout from "./Layout";
import { patientMenu } from "../Labels/Menu";
import "../../styles/adminLayout.css";

function PatientLayout() {
  return (
    <Layout
      sidebarTitle="Patient Portal"
      topbarTitle="Patient Panel"
      menuItems={patientMenu}
    />
  );
}

export default PatientLayout;
