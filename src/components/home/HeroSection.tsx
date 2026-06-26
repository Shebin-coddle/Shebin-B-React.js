import "../../styles/hero.css";
import { HandleBookAppointments } from "../../services/HandleBookAppointments";
import { useNavigate } from "react-router-dom";
import heroimage from "../../assets/heroSection/image-1.jpg";

function Hero() {
  const navigate = useNavigate();

  return (
    <section className="hero" id="home">
      <div className="hero-content">
        <span className="hero-tag">Trusted Healthcare Since 1970</span>

        <h1>
          Your Health Is Our{" "} <span>Highest Priority</span>
        </h1>

        <p>
          Experienced doctors, advanced medical facilities, and compassionate
          care for you and your family. Book appointments online and receive
          quality healthcare anytime.
        </p>

        <div className="hero-buttons">
          <button
            className="primary-btn"
            onClick={() =>
              HandleBookAppointments(
                navigate,
                Number(localStorage.getItem("role_id")),
              )
            }
          >
            Book Appointment
          </button>

          <button className="secondary-btn" onClick={() => navigate("/about")}>
            Learn More
          </button>
        </div>

        <div className="hero-stats">
          <div>
            <h3>50+</h3>
            <p>Doctors</p>
          </div>

          <div>
            <h3>10K+</h3>
            <p>Patients</p>
          </div>

          <div>
            <h3>20+</h3>
            <p>Departments</p>
          </div>
        </div>
      </div>

      <div className="hero-image">
        <img src={heroimage} alt="Hospital Doctors" />
      </div>
    </section>
  );
}

export default Hero;
