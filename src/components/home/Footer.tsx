import "../../styles/footer.css";
import {
  FaFacebookF,
  FaInstagram,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h2 className="footer-logo">City Hospital</h2>

          <p>
            Providing quality healthcare services with experienced doctors,
            modern facilities, and compassionate patient care.
          </p>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>

          <ul>
            <li>
              <a href="#home">Home</a>
            </li>

            <li>
              <a href="#services">Services</a>
            </li>

            <li>
              <a href="#appointment">Appointment</a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Departments</h3>

          <ul>
            <li>Cardiology</li>
            <li>Neurology</li>
            <li>Orthopedics</li>
            <li>Pediatrics</li>
            <li>Emergency Care</li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact Us</h3>

          <div className="footer-contact">
            <FaPhoneAlt />
            <span>+91 6238922842</span>
          </div>
          <div className="footer-contact">
            <FaEnvelope />
            <span>info@cityhospital.com</span>
          </div>
          <div className="footer-contact">
            <FaMapMarkerAlt />
            <span>Calicut, Kerala, India</span>
          </div>
          <div className="footer-social">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <FaFacebookF />
            </a>

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} City Hospital. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
export default Footer;
