import React from "react";
import {
  FaDumbbell,
  FaHeartbeat,
  FaUsers,
  FaCalendarAlt,
  FaLeaf,
} from "react-icons/fa";

const About = () => {
  return (
    <div className="min-h-screen mt-[100px] bg-gray-100">
      {/* Header Section */}
      <header className=" text-black mt-5 py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome to D'playce Sports & Recreation Hub
          </h1>
          <p className="text-lg md:text-xl">
            Your Destination for Fitness, Fun, and Wellness
          </p>
        </div>
      </header>

      {/* About Us Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            About Us
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            At D PLAYCE Sports & Recreation Hub, we are committed to providing a
            clean, safe, and inspiring environment for individuals and
            organizations to achieve their fitness and wellness goals. Our
            state-of-the-art facilities are designed to keep both your body and
            mind in shape.
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <FaLeaf className="text-6xl text-green-500 mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Our Mission
            </h3>
            <p className="text-gray-600">
              Our mission is to promote a healthy lifestyle by encouraging
              physical activity, mental well-being, and community engagement. We
              believe that a clean and welcoming environment is essential for
              achieving these goals.
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <FaHeartbeat className="text-6xl text-red-500 mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Fitness Goals
            </h3>
            <p className="text-gray-600">
              Whether you're looking to build strength, improve endurance, or
              simply stay active, our facilities and expert trainers are here to
              help you achieve your fitness goals.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose EliteFit Section */}
      <section className="bg-blue-50 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-8">
            Why Choose D PLAYCE?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <FaDumbbell className="text-5xl text-blue-500 mb-4 mx-auto" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Modern Equipment
              </h3>
              <p className="text-gray-600">
                State-of-the-art fitness equipment for all your workout needs.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <FaUsers className="text-5xl text-green-500 mb-4 mx-auto" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Expert Trainers
              </h3>
              <p className="text-gray-600">
                Certified trainers to guide you on your fitness journey.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <FaCalendarAlt className="text-5xl text-purple-500 mb-4 mx-auto" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Event Hosting
              </h3>
              <p className="text-gray-600">
                Perfect venue for corporate events, team-building, and more.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <FaLeaf className="text-5xl text-yellow-500 mb-4 mx-auto" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Clean Environment
              </h3>
              <p className="text-gray-600">
                A clean and hygienic space for your fitness and wellness needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Host Your Events Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Host Your Events With Us
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            D PLAYCE Sports & Recreation Hub is the ideal location for
            organizations and companies like JAMB, UBEC, and others to host
            events that capture people's attention. Whether it's a corporate
            retreat, a fitness challenge, or a community wellness program, our
            facilities provide the perfect backdrop for success.
          </p>
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300">
            Contact Us to Book Your Event
          </button>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 D PLAYCE Sports & Recreation Hub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default About;
