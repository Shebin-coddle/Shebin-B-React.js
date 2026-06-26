import "../../styles/actionSection.css";
import { useNavigate } from "react-router-dom";
import { HandleBookAppointments } from "../../services/HandleBookAppointments";

function ActionSection() {
  const navigate = useNavigate();

  return (
    <section className="action-section" id="appointment">
      <div className="action-content">
        <span className="action-tag">Need Medical Assistance?</span>

       <h2>
  Book an Appointment with Our{" "}
  <span>Expert Doctors</span>
</h2>

        <p>
          Get personalized healthcare from experienced specialists. Schedule
          your appointment online and receive quality care without waiting in
          long queues.
        </p>

        <div className="action-buttons">
          <button
            className="action-primary-btn"
            onClick={() =>
              HandleBookAppointments(
                navigate,
                Number(localStorage.getItem("role_id")),
              )
            }
          >
            Book Appointment
          </button>
        </div>
      </div>
    </section>
  );
}

export default ActionSection;
