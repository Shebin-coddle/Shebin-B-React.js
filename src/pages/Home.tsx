import Navbar from "../components/Home/NavBar";
import HeroSection from "../components/Home/HeroSection";
import ServicesSection from "../components/Home/ServiceSection";
import ActionSection from "../components/Home/ActionSection";
import Footer from "../components/Home/Footer";

function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
       <ServicesSection />
      <ActionSection />
      <Footer />  
    </>
  );
}

export default Home;