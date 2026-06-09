import "../../styles/serviceSection.css";
import {
  FaHeartbeat,
  FaBrain,
  FaBone,
  FaChild,
  FaAmbulance,

} from "react-icons/fa";

function ServicesSection() {
  const services = [
    {
      icon: <FaHeartbeat />,
      title: "Cardiology",
      description:
        "Comprehensive heart care with advanced diagnostics and treatments.",
    },
    {
      icon: <FaBrain />,
      title: "Neurology",
      description:
        "Specialized care for brain, spine, and nervous system disorders.",
    },
    {
      icon: <FaBone />,
      title: "Orthopedics",
      description:
        "Expert treatment for bones, joints, muscles, and injuries.",
    },
    {
      icon: <FaChild />,
      title: "Pediatrics",
      description:
        "Dedicated healthcare services for infants, children, and adolescents.",
    },
    {
      icon: <FaAmbulance />,
      title: "Emergency Care",
      description:
        "24/7 emergency services with rapid response and expert care.",
    },
    
  ];

  return (
    <section className="services-section" id="services">
      <div className="section-header">
        <span>Our Services</span>
        <h2>Healthcare Services We Provide</h2>
        <p>
          Delivering quality healthcare through specialized departments,
          experienced professionals, and modern medical facilities.
        </p>
      </div>

      <div className="services-grid">
        {services.map((service) => (
          <div className="service-card" key={service.title}>
            <div className="service-icon">{service.icon}</div>

            <h3>{service.title}</h3>

            <p>{service.description}</p>

           
          </div>
        ))}
      </div>
    </section>
  );
}

export default ServicesSection;