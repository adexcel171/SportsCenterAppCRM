import React from "react";
import { BsArrowRight, BsCheck2Circle } from "react-icons/bs";
import { GiGymBag, GiTrophyCup, GiTennisCourt } from "react-icons/gi";
import { MdOutlineSportsTennis } from "react-icons/md";
import { FaFutbol, FaBasketballBall, FaRunning } from "react-icons/fa";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom"; // Assuming React Router for navigation
import Footer from "./Footer";
import "./landing.css";

const Landing = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.2 });

  React.useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.2 } },
  };

  const facilities = [
    {
      title: "Tennis Courts",
      imgSrc:
        "https://plus.unsplash.com/premium_photo-1736900468189-9f80d7659f87?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8dGVubmlzJTIwcG5nfGVufDB8fDB8fHww",
      icon: <MdOutlineSportsTennis className="text-4xl text-white" />,
      description: "Play on professional-grade surfaces.",
      features: ["Hard & Clay Courts", "Night Lighting", "Pro Shop"],
    },
    {
      title: "Soccer Fields",
      imgSrc:
        "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
      icon: <FaFutbol className="text-4xl text-white" />,
      description: "FIFA-standard pitches for all levels.",
      features: ["Turf & Grass", "Stadium Seating", "Training Zones"],
    },
    {
      title: "Basketball Arenas",
      imgSrc:
        "https://images.unsplash.com/photo-1577471488278-16eec37ffcc2?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      icon: <FaBasketballBall className="text-4xl text-white" />,
      description: "Indoor courts with premium flooring.",
      features: ["Climate Control", "Scoreboards", "Locker Rooms"],
    },
    {
      title: "Gym & Fitness",
      imgSrc:
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
      icon: <GiGymBag className="text-4xl text-white" />,
      description: "State-of-the-art training equipment.",
      features: ["Cardio Zones", "Weight Rooms", "Personal Trainers"],
    },
  ];
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] md:min-h-screen text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-[url('https://img.freepik.com/free-photo/beautiful-black-girl-is-engaged-gym_1157-24008.jpg')] bg-cover bg-center bg-no-repeat animate-subtleZoom"
          style={{ backgroundAttachment: "fixed" }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/80" />
        </div>

        <div className="container mx-auto px-4 h-full mt-[100px]  flex items-center justify-center relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="text-center max-w-5xl"
          >
            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight"
            >
              <span className="bg-gradient-to-r from-red-500 via-orange-400 to-yellow-500 bg-clip-text text-transparent">
                D'playce
              </span>
              <br />
              Sports & Recreation Hub
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg sm:text-xl md:text-2xl mb-8 font-medium bg-black/60 px-6 py-3 rounded-full shadow-lg"
            >
              Abuja's Premier Destination for Elite Training & Competition
            </motion.p>

            <motion.div
              variants={stagger}
              className="flex flex-col sm:flex-row gap-4 mb-6 justify-center  items-center"
            >
              <motion.button
                variants={fadeInUp}
                className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 px-8 py-4 rounded-xl font-bold  w-[200px] flex items-center justify-center gap-2 shadow-lg transition-all transform hover:scale-105"
              >
                <GiTrophyCup className="text-xl" /> Book Facility
              </motion.button>
              <motion.div variants={fadeInUp}>
                <Link to="/programs">
                  <button className="border-2 border-white  hover:border-red-500 hover:text-red-500 px-8 py-4 rounded-xl font-bold w-[200px] flex items-center justify-center gap-2 transition-all transform hover:scale-105 bg-white/10">
                    <FaRunning className="text-xl" /> Subscibe
                  </button>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Facilities Grid */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="py-16 md:py-24 bg-gradient-to-b from-gray-50 pt-5 to-white"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <motion.h2
              variants={fadeInUp}
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 text-gray-900"
            >
              World-Class Facilities
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg"
            >
              Professional-grade venues designed for athletes at every level
            </motion.p>
          </div>
          <motion.div
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
          >
            {facilities.map((facility, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden group transform hover:-translate-y-2"
              >
                <div className="relative h-48 md:h-56">
                  <img
                    src={facility.imgSrc}
                    alt={facility.title}
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    {facility.icon}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl md:text-2xl font-bold mb-2 text-gray-900">
                    {facility.title}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm md:text-base">
                    {facility.description}
                  </p>
                  <ul className="space-y-2">
                    {facility.features.map((feature, fIndex) => (
                      <li
                        key={fIndex}
                        className="flex items-center text-gray-700 text-sm md:text-base"
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
        className="py-16 md:py-20 bg-gray-900 text-white"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <motion.div variants={fadeInUp} className="p-6">
              <div className="text-4xl md:text-5xl font-extrabold mb-2 text-red-500">
                15+
              </div>
              <div className="text-gray-300 text-sm md:text-base">
                Sports Disciplines
              </div>
            </motion.div>
            <motion.div variants={fadeInUp} className="p-6">
              <div className="text-4xl md:text-5xl font-extrabold mb-2 text-red-500">
                24/7
              </div>
              <div className="text-gray-300 text-sm md:text-base">
                Opening Hours
              </div>
            </motion.div>
            <motion.div variants={fadeInUp} className="p-6">
              <div className="text-4xl md:text-5xl font-extrabold mb-2 text-red-500">
                50+
              </div>
              <div className="text-gray-300 text-sm md:text-base">
                Professional Coaches
              </div>
            </motion.div>
            <motion.div variants={fadeInUp} className="p-6">
              <div className="text-4xl md:text-5xl font-extrabold mb-2 text-red-500">
                10K+
              </div>
              <div className="text-gray-300 text-sm md:text-base">
                Active Members
              </div>
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
        className="relative bg-[url('https://images.unsplash.com/photo-1598623335306-5d0040e41f4d?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center py-24 md:py-32"
      >
        <div className="absolute inset-0 bg-gray-900/75" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-extrabold mb-6 text-white tracking-tight">
            Ready to Elevate Your Game?
          </h2>
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Join our championship-winning community today
          </p>
          <Link to="/programs">
            <button className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 px-10 py-4 md:px-12 md:py-5 rounded-2xl text-lg md:text-xl font-bold text-white flex items-center gap-3 mx-auto shadow-lg transition-transform hover:scale-105">
              Start Your Journey{" "}
              <BsArrowRight className="animate-pulse text-xl" />
            </button>
          </Link>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
};

export default Landing;
