import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Wifi,
  Car,
  Utensils,
  Waves,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

const AylosBayHomepage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  // Hero slider images - Real Aylos Bay Hotel photos with Cloudinary transformations
  const heroSlides = [
    {
      image:
        "https://res.cloudinary.com/dugvudqm6/image/upload/c_fill,w_2000,h_1200,g_center,q_auto,f_auto/v1752366075/about2_rpedsw.jpg",
      title: "Lakeside Luxury Awaits",
      subtitle: "Experience tranquil elegance at Aylos Bay",
    },
    {
      image:
        "https://res.cloudinary.com/dugvudqm6/image/upload/c_fill,w_2000,h_1200,g_center,q_auto,f_auto/v1752366513/299337842_443129591167175_5419609786131939865_n_soyrvj.jpg",
      title: "Sophisticated Comfort",
      subtitle: "Where modern luxury meets timeless elegance",
    },
    /*{
      image:
        "https://res.cloudinary.com/dugvudqm6/image/upload/c_fill,w_2000,h_1200,g_center,q_auto,f_auto/v1752366591/485006259_18247044961304940_3097681052291838107_n_twmrjm.jpg",
      title: "Serene Retreat",
      subtitle: "Your perfect escape by the water",
    },*/
  ];

  // Room showcase data - Real Aylos Bay accommodations with optimized images
  const rooms = [
    {
      name: "Deluxe Lake View Suite",
      image:
        "https://res.cloudinary.com/dugvudqm6/image/upload/c_fill,w_800,h_600,g_center,q_auto,f_auto/v1743956585/IMG_9458_ethoiz.jpg",
      description:
        "Spacious suite with panoramic lake views and private balcony",
      features: ["King Bed", "Lake View", "Private Balcony", "Luxury Bathroom"],
    },
    {
      name: "Premium Garden Room",
      image:
        "https://res.cloudinary.com/dugvudqm6/image/upload/c_fill,w_800,h_600,g_center,q_auto,f_auto/v1743956586/IMG_9441_v4xiwm.jpg",
      description: "Elegant room overlooking manicured gardens",
      features: [
        "Queen Bed",
        "Garden View",
        "Sitting Area",
        "Modern Amenities",
      ],
    },
    {
      name: "Executive Waterfront Suite",
      image:
        "https://res.cloudinary.com/dugvudqm6/image/upload/c_fill,w_800,h_600,g_center,q_auto,f_auto/v1752366514/489610204_18249200683304940_3627564340231092958_n_aukj4m.jpg",
      description: "Our finest accommodation with direct water access",
      features: [
        "King Bed",
        "Waterfront Access",
        "Private Terrace",
        "Premium Amenities",
      ],
    },
    {
      name: "Lakeside Luxury Room",
      image:
        "https://res.cloudinary.com/dugvudqm6/image/upload/c_fill,w_800,h_600,g_center,q_auto,f_auto/v1752366513/475980092_1068103765336418_3504903717428290079_n_cshsjd.jpg",
      description: "Beautiful room with stunning lake views and modern comfort",
      features: [
        "Queen Bed",
        "Lake View",
        "Modern Design",
        "Premium Amenities",
      ],
    },
    {
      name: "Superior Bay Room",
      image:
        "https://res.cloudinary.com/dugvudqm6/image/upload/c_fill,w_800,h_600,g_center,q_auto,f_auto/v1752366080/IMG_1409_dgct9g.jpg",
      description:
        "Comfortable accommodation with bay views and elegant furnishings",
      features: ["King Bed", "Bay View", "Elegant Design", "Full Amenities"],
    },
    {
      name: "Classic Comfort Suite",
      image:
        "https://res.cloudinary.com/dugvudqm6/image/upload/c_fill,w_800,h_600,g_center,q_auto,f_auto/v1752366078/IMG_1661_vc0vhr.jpg",
      description: "Thoughtfully designed suite combining comfort with style",
      features: [
        "Queen Bed",
        "Stylish Design",
        "Comfort Features",
        "Modern Bathroom",
      ],
    },
  ];

  // Amenities data
  const amenities = [
    {
      icon: <Wifi size={32} />,
      title: "Complimentary Wi-Fi",
      description: "High-speed internet throughout the property",
    },
    {
      icon: <Car size={32} />,
      title: "Valet Parking",
      description: "Secure parking with professional service",
    },
    {
      icon: <Utensils size={32} />,
      title: "Fine Dining",
      description: "Exquisite cuisine with lake views",
    },
    {
      icon: <Waves size={32} />,
      title: "Water Activities",
      description: "Kayaking, fishing, and lake excursions",
    },
  ];

  // Auto-advance slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  // Scroll detection for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length
    );
  };

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  const headerStyle = {
    position: "fixed",
    top: 0,
    width: "100%",
    zIndex: 1000,
    transition: "all 0.3s ease",
    backgroundColor: isScrolled ? "white" : "transparent",
    boxShadow: isScrolled ? "0 10px 15px -3px rgba(0, 0, 0, 0.1)" : "none",
  };

  const headerContentStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "1rem 1.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };

  const logoSectionStyle = {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  };

  const logoImageStyle = {
    height: "2.5rem",
    width: "auto",
    objectFit: "contain",
  };

  const logoTextStyle = {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: isScrolled ? "#1f2937" : "white",
    transition: "color 0.3s ease",
  };

  const navMenuStyle = {
    display: "flex",
    gap: "2rem",
  };

  const navItemStyle = {
    background: "none",
    border: "none",
    fontWeight: "500",
    cursor: "pointer",
    transition: "color 0.3s ease",
    padding: "0.5rem 0",
    color: isScrolled ? "#374151" : "white",
  };

  const bookNowBtnStyle = {
    backgroundColor: "#fbbf24",
    color: "#1f2937",
    padding: "0.5rem 1.5rem",
    borderRadius: "9999px",
    fontWeight: "500",
    border: "none",
    cursor: "pointer",
    transition: "all 0.3s ease",
  };

  const heroSectionStyle = {
    position: "relative",
    height: "100vh",
    overflow: "hidden",
  };

  const heroSlideStyle = (index) => ({
    position: "absolute",
    inset: 0,
    transition: "opacity 1s ease",
    opacity: index === currentSlide ? 1 : 0,
  });

  const heroImageStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  };

  const heroOverlayStyle = {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  };

  const heroContentStyle = {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    color: "white",
  };

  const heroTextStyle = {
    maxWidth: "1000px",
    padding: "0 1.5rem",
  };

  const heroTitleStyle = {
    fontSize: "3rem",
    fontWeight: "300",
    marginBottom: "1.5rem",
    lineHeight: "1.2",
  };

  const heroSubtitleStyle = {
    fontSize: "1.25rem",
    marginBottom: "2rem",
    fontWeight: "300",
  };

  const heroCtaStyle = {
    backgroundColor: "#fbbf24",
    color: "#1f2937",
    padding: "0.75rem 2rem",
    borderRadius: "9999px",
    fontSize: "1.125rem",
    fontWeight: "500",
    border: "none",
    cursor: "pointer",
    transition: "all 0.3s ease",
  };

  const sectionStyle = (bgColor = "white") => ({
    padding: "5rem 0",
    backgroundColor: bgColor,
  });

  const containerStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 1.5rem",
  };

  const sectionHeaderStyle = {
    textAlign: "center",
    marginBottom: "4rem",
  };

  const sectionTitleStyle = (color = "#1f2937") => ({
    fontSize: "2.5rem",
    fontWeight: "300",
    color: color,
    marginBottom: "1.5rem",
  });

  const sectionSubtitleStyle = (color = "#6b7280") => ({
    fontSize: "1.125rem",
    color: color,
    maxWidth: "48rem",
    margin: "0 auto",
    lineHeight: "1.7",
  });

  const roomsGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
    gap: "2rem",
  };

  const roomCardStyle = {
    cursor: "pointer",
    transition: "transform 0.3s ease",
  };

  const roomImageContainerStyle = {
    position: "relative",
    overflow: "hidden",
    borderRadius: "0.5rem",
    marginBottom: "1.5rem",
  };

  const roomImageStyle = {
    width: "100%",
    height: "16rem",
    objectFit: "cover",
    transition: "transform 0.5s ease",
  };

  const roomNameStyle = {
    fontSize: "1.25rem",
    fontWeight: "500",
    color: "#1f2937",
    marginBottom: "0.75rem",
  };

  const roomDescriptionStyle = {
    color: "#6b7280",
    marginBottom: "1rem",
  };

  const roomFeaturesStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
  };

  const roomFeatureStyle = {
    fontSize: "0.875rem",
    backgroundColor: "#f3f4f6",
    color: "#374151",
    padding: "0.25rem 0.75rem",
    borderRadius: "9999px",
  };

  const amenitiesGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "2rem",
  };

  const amenityCardStyle = {
    textAlign: "center",
    transition: "transform 0.3s ease",
  };

  const amenityIconStyle = {
    width: "4rem",
    height: "4rem",
    backgroundColor: "#fbbf24",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 1.5rem",
    transition: "backgroundColor 0.3s ease",
    color: "#1f2937",
  };

  const amenityTitleStyle = {
    fontSize: "1.25rem",
    fontWeight: "500",
    color: "#1f2937",
    marginBottom: "0.75rem",
  };

  const amenityDescriptionStyle = {
    color: "#6b7280",
  };

  const contactGridStyle = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "3rem",
    maxWidth: "1000px",
    margin: "0 auto",
  };

  const contactItemStyle = {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    marginBottom: "1rem",
  };

  const contactIconStyle = {
    color: "#fbbf24",
    width: "1.5rem",
    height: "1.5rem",
  };

  const formInputStyle = {
    width: "100%",
    padding: "0.75rem 1rem",
    border: "1px solid #d1d5db",
    borderRadius: "0.5rem",
    fontSize: "1rem",
    marginBottom: "1rem",
  };

  const formButtonStyle = {
    width: "100%",
    backgroundColor: "#fbbf24",
    color: "#1f2937",
    padding: "0.75rem 1.5rem",
    borderRadius: "0.5rem",
    fontWeight: "500",
    border: "none",
    cursor: "pointer",
  };

  const footerStyle = {
    backgroundColor: "#1f2937",
    color: "white",
    padding: "3rem 0",
  };

  const footerContentStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "white",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
      }}
    >
      {/* Header */}
      <header style={headerStyle}>
        <div style={headerContentStyle}>
          <div style={logoSectionStyle}>
            <img
              src="https://res.cloudinary.com/dugvudqm6/image/upload/c_fit,h_40,w_120,q_auto,f_auto/v1752369918/PHOTO-2025-03-20-09-16-17_irdknb.jpg"
              alt="Aylos Bay Hotel Logo"
              style={logoImageStyle}
            />
            <h1 style={logoTextStyle}>Aylos Bay Resort</h1>
          </div>

          <nav style={navMenuStyle}>
            {["About", "Rooms", "Amenities", "Contact"].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                style={navItemStyle}
              >
                {item}
              </button>
            ))}
          </nav>

          <button
            onClick={() => (window.location.href = "/booking")}
            style={bookNowBtnStyle}
          >
            BOOK NOW
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section style={heroSectionStyle}>
        {heroSlides.map((slide, index) => (
          <div key={index} style={heroSlideStyle(index)}>
            <img style={heroImageStyle} src={slide.image} alt={slide.title} />
            <div style={heroOverlayStyle}></div>
          </div>
        ))}

        <div style={heroContentStyle}>
          <div style={heroTextStyle}>
            <h2 style={heroTitleStyle}>{heroSlides[currentSlide].title}</h2>
            <p style={heroSubtitleStyle}>{heroSlides[currentSlide].subtitle}</p>
            <button
              onClick={() => (window.location.href = "/booking")}
              style={heroCtaStyle}
            >
              DISCOVER YOUR ESCAPE
            </button>
          </div>
        </div>

        {/* Navigation Controls */}
        <button
          onClick={prevSlide}
          style={{
            position: "absolute",
            left: "1.5rem",
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            color: "white",
            cursor: "pointer",
          }}
        >
          <ChevronLeft size={32} />
        </button>
        <button
          onClick={nextSlide}
          style={{
            position: "absolute",
            right: "1.5rem",
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            color: "white",
            cursor: "pointer",
          }}
        >
          <ChevronRight size={32} />
        </button>

        {/* Slide Indicators */}
        <div
          style={{
            position: "absolute",
            bottom: "2rem",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: "0.5rem",
          }}
        >
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              style={{
                width: "0.75rem",
                height: "0.75rem",
                borderRadius: "50%",
                border: "none",
                cursor: "pointer",
                backgroundColor:
                  index === currentSlide ? "white" : "rgba(255, 255, 255, 0.5)",
              }}
            />
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" style={sectionStyle("#f9fafb")}>
        <div style={containerStyle}>
          <div
            style={{
              maxWidth: "1000px",
              margin: "0 auto",
              textAlign: "center",
            }}
          >
            <h2 style={sectionTitleStyle()}>A Haven of Tranquil Luxury</h2>
            <p
              style={{
                fontSize: "1.125rem",
                color: "#6b7280",
                marginBottom: "2rem",
                lineHeight: "1.7",
              }}
            >
              Nestled on the serene shores of pristine waters, Aylos Bay Hotel
              offers an unparalleled retreat where luxury meets nature. Our
              boutique property features six exquisitely designed
              accommodations, each thoughtfully crafted to provide the ultimate
              in comfort and sophistication.
            </p>
            <p
              style={{
                fontSize: "1.125rem",
                color: "#6b7280",
                lineHeight: "1.7",
              }}
            >
              From panoramic lake views to world-class amenities, every detail
              has been carefully curated to create an unforgettable experience.
              Discover your perfect escape at Aylos Bay, where tranquility and
              elegance converge.
            </p>
          </div>
        </div>
      </section>

      {/* Rooms Section */}
      <section id="rooms" style={sectionStyle()}>
        <div style={containerStyle}>
          <div style={sectionHeaderStyle}>
            <h2 style={sectionTitleStyle()}>Luxury Accommodations</h2>
            <p style={sectionSubtitleStyle()}>
              Six distinctive rooms and suites, each offering a unique
              perspective on lakeside luxury
            </p>
          </div>

          <div style={roomsGridStyle}>
            {rooms.map((room, index) => (
              <div key={index} style={roomCardStyle}>
                <div style={roomImageContainerStyle}>
                  <img
                    src={room.image}
                    alt={room.name}
                    style={roomImageStyle}
                  />
                </div>
                <h3 style={roomNameStyle}>{room.name}</h3>
                <p style={roomDescriptionStyle}>{room.description}</p>
                <div style={roomFeaturesStyle}>
                  {room.features.map((feature, featureIndex) => (
                    <span key={featureIndex} style={roomFeatureStyle}>
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "3rem" }}>
            <button
              onClick={() => (window.location.href = "/booking")}
              style={heroCtaStyle}
            >
              VIEW ALL ROOMS & BOOK
            </button>
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section id="amenities" style={sectionStyle("#f9fafb")}>
        <div style={containerStyle}>
          <div style={sectionHeaderStyle}>
            <h2 style={sectionTitleStyle()}>Exceptional Amenities</h2>
            <p style={sectionSubtitleStyle()}>
              Thoughtfully designed services and facilities to enhance your stay
            </p>
          </div>

          <div style={amenitiesGridStyle}>
            {amenities.map((amenity, index) => (
              <div key={index} style={amenityCardStyle}>
                <div style={amenityIconStyle}>{amenity.icon}</div>
                <h3 style={amenityTitleStyle}>{amenity.title}</h3>
                <p style={amenityDescriptionStyle}>{amenity.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={sectionStyle("#1f2937")}>
        <div style={containerStyle}>
          <div style={{ textAlign: "center" }}>
            <h2 style={sectionTitleStyle("#fbbf24")}>
              Ready to Experience Luxury?
            </h2>
            <p style={sectionSubtitleStyle("#d1d5db")}>
              Book your stay at Aylos Bay Hotel and discover the perfect blend
              of tranquility and sophistication
            </p>
            <button
              onClick={() => (window.location.href = "/booking")}
              style={{
                backgroundColor: "#fbbf24",
                color: "#1f2937",
                padding: "0.75rem 2rem",
                borderRadius: "9999px",
                fontSize: "1.125rem",
                fontWeight: "500",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              BOOK YOUR STAY NOW
            </button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" style={sectionStyle()}>
        <div style={containerStyle}>
          <div style={sectionHeaderStyle}>
            <h2 style={sectionTitleStyle()}>Get in Touch</h2>
            <p style={sectionSubtitleStyle()}>
              We're here to help you plan your perfect lakeside retreat
            </p>
          </div>

          <div style={contactGridStyle}>
            <div>
              <h3
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "500",
                  color: "#1f2937",
                  marginBottom: "1.5rem",
                }}
              >
                Contact Information
              </h3>
              <div style={contactItemStyle}>
                <Phone style={contactIconStyle} />
                <div>
                  <p style={{ fontWeight: "500" }}>Phone</p>
                  <p style={{ color: "#6b7280" }}>+233 24 337 4443</p>
                </div>
              </div>
              <div style={contactItemStyle}>
                <Mail style={contactIconStyle} />
                <div>
                  <p style={{ fontWeight: "500" }}>Email</p>
                  <p style={{ color: "#6b7280" }}>info@aylosbayghana.com</p>
                </div>
              </div>
              <div style={contactItemStyle}>
                <MapPin style={contactIconStyle} />
                <div>
                  <p style={{ fontWeight: "500" }}>Address</p>
                  <p style={{ color: "#6b7280" }}>
                    123 Lakeside Drive
                    <br />
                    Atimpoku, Ghana
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "500",
                  color: "#1f2937",
                  marginBottom: "1.5rem",
                }}
              >
                Quick Inquiry
              </h3>
              <div>
                <input
                  type="text"
                  placeholder="Your Name"
                  style={formInputStyle}
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  style={formInputStyle}
                />
                <textarea
                  placeholder="Your Message"
                  rows="4"
                  style={{ ...formInputStyle, resize: "vertical" }}
                ></textarea>
                <button
                  onClick={() =>
                    alert(
                      "Thank you for your inquiry! We will get back to you soon."
                    )
                  }
                  style={formButtonStyle}
                >
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={footerStyle}>
        <div style={containerStyle}>
          <div style={footerContentStyle}>
            <div style={logoSectionStyle}>
              <img
                src="https://res.cloudinary.com/dugvudqm6/image/upload/c_fit,h_32,w_96,q_auto,f_auto/v1752369918/PHOTO-2025-03-20-09-16-17_irdknb.jpg"
                alt="Aylos Bay Hotel Logo"
                style={{ ...logoImageStyle, height: "2rem" }}
              />
              <h3 style={{ fontSize: "1.25rem", fontWeight: "bold" }}>
                Aylos Bay Hotel
              </h3>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ color: "#9ca3af", marginBottom: "0.5rem" }}>
                © 2025 Aylos Bay Hotel. All rights reserved.
              </p>
              <p style={{ color: "#9ca3af" }}>A haven of tranquil luxury</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AylosBayHomepage;
