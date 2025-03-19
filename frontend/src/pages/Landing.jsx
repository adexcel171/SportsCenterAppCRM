import React from "react";
import { BsArrowRight, BsCheck2Circle } from "react-icons/bs";
import { GiGymBag, GiTrophyCup, GiTennisCourt } from "react-icons/gi";
import { MdOutlineSportsTennis, MdRestaurantMenu } from "react-icons/md";
import { FaFutbol, FaBasketballBall, FaRunning } from "react-icons/fa";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Footer from "./Footer";

const Landing = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView();

  React.useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const stagger = {
    visible: {
      transition: {
        staggerChildren: 0.5,
      },
    },
  };
  const facilities = [];
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-screen md:min-h-screen text-white">
        {/* Background Image */}
        <div
          className="absolute inset-0 min-h-screen bg-[url('https://img.freepik.com/free-photo/beautiful-black-girl-is-engaged-gym_1157-24008.jpg?t=st=1738595882~exp=1738599482~hmac=117918f2125c7d1dae8235cd1abbfca81cafaab7fd10eb6aca99c0a687e5a88b&w=740')] 
bg-cover bg-top bg-no-repeat"
        ></div>

        {/* Content Container */}
        <div className="container mx-auto px-4 h-full flex items-center relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="max-w-4xl justify-center flex flex-col text-center mx-auto"
          >
            {/* Heading */}
            <motion.h1
              variants={fadeInUp}
              className="text-5xl md:text-6xl font-black mb-6 leading-tight"
            >
              <span className="bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">
                D'PLAYCE
              </span>
              <br />
              Sports & Recreation Hub
            </motion.h1>

            {/* Subheading */}
            <motion.p
              variants={fadeInUp}
              className="text-xl md:text-2xl mb-8 font-light bg-black bg-opacity-50 px-4 py-2 rounded-lg inline-block"
            >
              Abuja's premier destination for elite training and competition
            </motion.p>

            {/* Buttons */}
            <motion.div
              variants={stagger}
              className="flex flex-col md:flex-row gap-4 justify-center items-center"
            >
              <motion.button
                variants={fadeInUp}
                className="bg-red-500 hover:bg-red-700 px-8 py-4 rounded-xl text-center font-bold w-[200px] flex items-center gap-2 transition-all transform hover:scale-105"
              >
                <GiTrophyCup /> Book Facility
              </motion.button>
              <motion.button
                variants={fadeInUp}
                className="border-2 border-white hover:border-red-500 text-center w-[200px] hover:text-red-500 px-8 py-4 rounded-xl font-bold flex items-center gap-2 transition-all"
              >
                <FaRunning /> Join Club
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Facilities Grid */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="py-20 bg-gradient-to-b from-white to-gray-50"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-black mb-4"
            >
              World-Class Facilities
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              className="text-gray-600 max-w-2xl mx-auto text-lg"
            >
              Professional-grade venues designed for athletes at every level
            </motion.p>
          </div>
          <motion.div
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {facilities.map((facility, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
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
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="py-20 bg-gradient-to-b from-white to-gray-50"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <motion.div variants={fadeInUp} className="p-6">
              <div className="text-5xl font-black mb-2 text-red-500">15+</div>
              <div className="text-gray-400">Sports Disciplines</div>
            </motion.div>
            <motion.div variants={fadeInUp} className="p-6">
              <div className="text-5xl font-black mb-2 text-red-500">24/7</div>
              <div className="text-gray-400">Opening Hours</div>
            </motion.div>
            <motion.div variants={fadeInUp} className="p-6">
              <div className="text-5xl font-black mb-2 text-red-500">50+</div>
              <div className="text-gray-400">Professional Coaches</div>
            </motion.div>
            <motion.div variants={fadeInUp} className="p-6">
              <div className="text-5xl font-black mb-2 text-red-500">10k+</div>
              <div className="text-gray-400">Active Members</div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={fadeInUp}
        className="relative bg-[url('https://example.com/cta-bg.jpg')] bg-cover bg-center py-32"
      >
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
      </motion.section>

      <Footer />
    </div>
  );
};

export default Landing;
