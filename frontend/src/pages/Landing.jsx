import React from "react";
import { BsArrowRight } from "react-icons/bs";
import { GiGymBag, GiTrophyCup } from "react-icons/gi";
import { MdRestaurantMenu } from "react-icons/md";
import Footer from "./Footer";
const Landing = () => {
  const facilities = [
    {
      title: "Football Field",
      description:
        "Professional-grade football field with artificial turf and floodlights for evening matches.",
      imgSrc:
        "https://as1.ftcdn.net/jpg/04/58/24/44/1000_F_458244461_AEBVI26a3nsY5Mmp7wQGtsY9lMt2320o.jpg",
      features: [
        "FIFA standard dimensions",
        "High-quality artificial turf",
        "Floodlights",
        "Changing rooms",
      ],
    },
    {
      title: "Basketball Court",
      description:
        "Indoor basketball court with premium flooring and professional equipment.",
      imgSrc:
        "https://dopeblack.org/wp-content/uploads/2023/05/Screenshot-2023-05-16-at-13.34.25.png",
      features: [
        "Professional hoops",
        "Spectator seating",
        "Score boards",
        "Training equipment",
      ],
    },
    {
      title: "Badminton Courts",
      description:
        "Multiple indoor badminton courts with proper lighting and ventilation.",
      imgSrc:
        "https://cdn.britannica.com/44/256944-050-8D414329/PV-Sindhu-2020-Tokyo-Olympics.jpg",
      features: [
        "4 professional courts",
        "Tournament-ready",
        "Equipment rental",
        "Coaching available",
      ],
    },
    {
      title: "Tennis Courts",
      description:
        "Premium lawn tennis courts maintained to international standards.",
      imgSrc:
        "https://www.shutterstock.com/image-photo/black-man-tennis-ball-fitness-600nw-2229454571.jpg",
      features: [
        "Clay and hard courts",
        "Night lighting",
        "Pro shop",
        "Tennis lessons",
      ],
    },
    {
      title: "Modern Gym",
      description:
        "State-of-the-art gym equipped with the latest fitness equipment.",
      imgSrc:
        "https://m8group.co.uk/wp-content/uploads/2023/03/Untitled-design-4-1536x1020.png",
      features: [
        "Modern equipment",
        "Personal trainers",
        "Cardio zone",
        "Free weights area",
      ],
    },
    {
      title: "Restaurant",
      description: "",
      imgSrc: "https://upload.wikimedia.org/wikipedia/commons/c/c6/Food.png",
      features: [
        "Healthy menu",
        "Sports bar",
        "Event catering",
        "Outdoor seating",
      ],
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="relative bg-blue-900 h-[100vh] text-white py-24">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center h-[100vh] bg-no-repeat"
            style={{
              backgroundImage:
                "url('https://m8group.co.uk/wp-content/uploads/2023/03/Untitled-design-4-1536x1020.png')",
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          </div>

          {/* Content */}
          <div className="container mx-auto px-4 mt-[150px] text-center relative z-10">
            <h1 className="text-5xl  font-extrabold mb-6 md:text-6xl">
              Welcome to <br /> D' PLAYCE RECREATIONAL CENTER
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto md:text-2xl">
              Your Premier Destination for Sports and Fitness
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col mt-[100px] md:flex-row text-center items-center justify-center gap-4">
              <button className="bg-white text-blue-900 text-center justify-center px-6 py-3 rounded-lg font-semibold hover:bg-blue-100 transition-colors flex items-center gap-2">
                Book Now <BsArrowRight size={20} />
              </button>
              <button className="border-2 border-white px-6 py-3 rounded-lg text-center font-semibold hover:bg-blue-800 transition-colors justify-center flex items-center gap-2">
                View Facilities <GiTrophyCup size={20} />
              </button>
            </div>
          </div>
        </div>
        {/* Features Section */}
        <div className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Our World-Class Facilities
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {facilities.map((facility, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <img
                    src={facility.imgSrc}
                    alt={facility.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{facility.title}</h3>
                    <p className="text-gray-600 mb-4">{facility.description}</p>
                    <ul className="space-y-2">
                      {facility.features.map((feature, fIndex) => (
                        <li
                          key={fIndex}
                          className="flex items-center text-gray-700"
                        >
                          <BsArrowRight
                            size={16}
                            className="text-blue-600 mr-2"
                          />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="bg-blue-900 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="mb-8 text-lg">
              Join us today and experience the best in sports and fitness
            </p>
            <div className="flex justify-center gap-6">
              <div className="flex items-center gap-2">
                <GiGymBag size={24} />
                <span>Professional Equipment</span>
              </div>
              <div className="flex items-center gap-2">
                <GiTrophyCup size={24} />
                <span>Expert Coaching</span>
              </div>
              <div className="flex items-center gap-2">
                <MdRestaurantMenu size={24} />
                <span>Healthy Dining</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Landing;
