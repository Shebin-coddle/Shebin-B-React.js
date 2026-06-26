import Navbar from "../components/home/NavBar";
import HeroSection from "../components/home/HeroSection";
import ServicesSection from "../components/home/ServiceSection";
import ActionSection from "../components/home/ActionSection";
import Footer from "../components/home/Footer";
import SliderSection from "../components/home/SliderSection";

function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <SliderSection />
      <ServicesSection />
      <ActionSection />
      <Footer />
    </>
  );
}

export default Home;
