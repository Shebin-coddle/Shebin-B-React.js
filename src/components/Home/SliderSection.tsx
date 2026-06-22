import { useState, useEffect } from "react";
import "../../styles/sliderSection.css";
import slider1 from "../../assets/sliderSection/slider-1.jpg";
import slider2 from "../../assets/sliderSection/slider-2.jpg";
import slider3 from "../../assets/sliderSection/slider-3.jpg";


function SliderSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "We Value Your Trust",
      description:
        "Experienced doctors, advanced medical facilities, and compassionate care for every patient.",
      image: slider1,
    },
    {
      title: "Advanced Medical Technology",
      description:
        "Modern equipment and innovative treatment methods for better healthcare outcomes.",
      image: slider2,
    },
    {
      title: "24/7 Emergency Services",
      description:
        "Round-the-clock emergency care with dedicated specialists ready to help.",
      image: slider3,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const slide = slides[currentSlide];

  return (
    <section className="slider-section">
      <div className="slider-container">
        <div className="slider-image">
          <img src={slide.image} alt={slide.title} />
        </div>

        <div className="slider-content">
          <h2>{slide.title}</h2>
          <p>{slide.description}</p>
        </div>
      </div>

      <div className="slider-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={currentSlide === index ? "dot active" : "dot"}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </section>
  );
}

export default SliderSection;
