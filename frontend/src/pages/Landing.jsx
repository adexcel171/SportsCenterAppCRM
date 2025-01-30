import React from "react";
import { BsArrowRight, BsCheck2Circle } from "react-icons/bs";
import { GiGymBag, GiTrophyCup, GiTennisCourt } from "react-icons/gi";
import { MdOutlineSportsTennis, MdRestaurantMenu } from "react-icons/md";
import { FaFutbol, FaBasketballBall, FaRunning } from "react-icons/fa";
import Footer from "./Footer";

const Landing = () => {
  const facilities = [
    {
      title: "Football Field",
      icon: <FaFutbol className="text-4xl text-red-600" />,
      description: "FIFA-certified artificial turf with floodlight system",
      imgSrc: "https://example.com/football-field.jpg",
      features: [
        "International dimensions",
        "Night matches",
        "Locker rooms",
        "VIP seating",
      ],
    },
    {
      title: "Basketball Court",
      icon: <FaBasketballBall className="text-4xl text-orange-500" />,
      description: "Indoor professional court with electronic scoreboard",
      imgSrc: "https://example.com/basketball-court.jpg",
      features: [
        "NBA-standard hoops",
        "Training programs",
        "Tournament hosting",
        "Pro shop",
      ],
    },
    {
      title: "Tennis Complex",
      icon: <MdOutlineSportsTennis className="text-4xl text-emerald-600" />,
      description: "Clay & hard courts with professional coaching",
      imgSrc: "https://example.com/tennis-court.jpg",
      features: [
        "10 championship courts",
        "Ball machines",
        "Junior programs",
        "Court rental",
      ],
    },
    {
      title: "Performance Gym",
      icon: <FaRunning className="text-4xl text-purple-600" />,
      description: "10,000 sqft premium fitness facility",
      imgSrc: "https://example.com/gym.jpg",
      features: [
        "Crossfit zone",
        "Olympic lifting",
        "Sauna/steam",
        "Personal training",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 to-red-900 h-screen text-white">
        <div className="absolute inset-0 bg-[url('https://example.com/gym-bg.jpg')] bg-cover bg-center mix-blend-overlay" />
        <div className="container mx-auto px-4 h-full flex items-center relative z-10">
          <div className="max-w-4xl text-center mx-auto">
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              <span className="bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">
                D'PLAYCE
              </span>
              <br />
              SPORTS & PERFORMANCE
            </h1>
            <p className="text-xl md:text-2xl mb-8 font-light">
              Lagos' premier destination for elite training and competition
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <button className="bg-red-600 hover:bg-red-700 px-8 py-4 rounded-xl font-bold flex items-center gap-2 transition-all transform hover:scale-105">
                <GiTrophyCup /> Book Facility
              </button>
              <button className="border-2 border-white hover:border-red-500 hover:text-red-500 px-8 py-4 rounded-xl font-bold flex items-center gap-2 transition-all">
                <FaRunning /> Join Club
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities Grid */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              World-Class Facilities
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Professional-grade venues designed for athletes at every level
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {facilities.map((facility, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all overflow-hidden group"
              >
                <div className="relative h-48 bg-gray-900">
                  <img
                    src={facility.imgSrc}
                    alt={facility.title}
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900" />
                  <div className="absolute bottom-4 left-4">
                    {facility.icon}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2">{facility.title}</h3>
                  <p className="text-gray-600 mb-4">{facility.description}</p>
                  <ul className="space-y-2">
                    {facility.features.map((feature, fIndex) => (
                      <li
                        key={fIndex}
                        className="flex items-center text-gray-700"
                      >
                        <BsCheck2Circle className="text-red-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <div className="text-5xl font-black mb-2 text-red-500">15+</div>
              <div className="text-gray-400">Sports Disciplines</div>
            </div>
            <div className="p-6">
              <div className="text-5xl font-black mb-2 text-red-500">24/7</div>
              <div className="text-gray-400">Opening Hours</div>
            </div>
            <div className="p-6">
              <div className="text-5xl font-black mb-2 text-red-500">50+</div>
              <div className="text-gray-400">Professional Coaches</div>
            </div>
            <div className="p-6">
              <div className="text-5xl font-black mb-2 text-red-500">10k+</div>
              <div className="text-gray-400">Active Members</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative bg-[url('https://example.com/cta-bg.jpg')] bg-cover bg-center py-32">
        <div className="absolute inset-0 bg-gray-900/80" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-black mb-6 text-white">
            Ready to Elevate Your Game?
          </h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Join our championship-winning community today
          </p>
          <button className="bg-red-600 hover:bg-red-700 px-12 py-5 rounded-2xl text-xl font-bold text-white flex items-center gap-3 mx-auto transition-transform hover:scale-105">
            Start Your Journey <BsArrowRight className="animate-pulse" />
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
