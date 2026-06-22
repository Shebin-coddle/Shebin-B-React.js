
import Navbar from "../components/Home/NavBar";
import "../styles/about.css"
import Footer from "../components/Home/Footer";
import BreadCrumbs from "../components/BreadCrumps";


function About() {
  return (
    <div>
    <Navbar/>
    <section className="about-page">
      <BreadCrumbs/>
      <div className="about-hero">
        <h1>Welcome to City Hospital</h1>
        <p>
          City Hospital is committed to providing quality healthcare services
          with compassion, professionalism, and modern medical facilities. We
          strive to deliver exceptional care and improve the well-being of our
          community.
        </p>
      </div>

      <div className="about-section">
        <h2>Who We Are</h2>
        <p>
          City Hospital is a multi-specialty healthcare institution dedicated to
          delivering comprehensive medical services. Our team of experienced
          doctors, nurses, and healthcare professionals works together to ensure
          every patient receives personalized and effective treatment in a safe
          and comfortable environment.
        </p>
      </div>

      <div className="about-section">
        <h2>Our Services</h2>

        <div className="feature-grid">
          <div className="feature-card">
            <h3>General Medicine</h3>
            <p>
              Comprehensive diagnosis, treatment, and preventive healthcare
              services for patients of all ages.
            </p>
          </div>

          <div className="feature-card">
            <h3>Specialized Care</h3>
            <p>
              Expert medical services across multiple specialties with advanced
              treatment options.
            </p>
          </div>

          <div className="feature-card">
            <h3>Emergency Services</h3>
            <p>
              Round-the-clock emergency care supported by skilled medical
              professionals and modern facilities.
            </p>
          </div>

          <div className="feature-card">
            <h3>Patient-Centered Care</h3>
            <p>
              Compassionate and personalized healthcare focused on patient
              comfort, safety, and recovery.
            </p>
          </div>
        </div>
      </div>

      <div className="about-section mission-vision">
        <div>
          <h2>Our Mission</h2>
          <p>
            To provide accessible, affordable, and high-quality healthcare
            services while treating every patient with compassion, dignity, and
            respect.
          </p>
        </div>

        <div>
          <h2>Our Vision</h2>
          <p>
            To be a trusted healthcare institution recognized for medical
            excellence, innovation, and patient satisfaction.
          </p>
        </div>
      </div>

      <div className="about-section">
        <h2>Why Choose City Hospital?</h2>

        <ul>
          <li>Experienced and dedicated healthcare professionals</li>
          <li>Modern medical facilities and advanced technology</li>
          <li>Comprehensive multi-specialty healthcare services</li>
          <li>24/7 emergency and patient support services</li>
          <li>Compassionate, patient-focused approach to care</li>
        </ul>
      </div>
    </section>
    <Footer/>
    </div>
  );
}

export default About;