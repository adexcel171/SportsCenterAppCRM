import React from "react";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { GiGymBag, GiTrophyCup, GiWeightLiftingUp } from "react-icons/gi";
import { MdEmail, MdLocationOn, MdPhone, MdSchedule } from "react-icons/md";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* CTA Section */}
      <div className="bg-gradient-to-r from-gray-900 via-red-950 to-gray-900 py-12 sm:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80')] bg-cover bg-center opacity-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
            <div className="text-center md:text-left">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-4 sm:mb-6 text-white leading-tight">
                Transform Your Body <br />
                <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                  Today
                </span>
              </h2>
              <div className="flex flex-wrap justify-center md:justify-start gap-3 sm:gap-4 mb-6">
                {["24/7 Access", "Free Trial", "Expert Coaches"].map((tag) => (
                  <span
                    key={tag}
                    className="bg-red-600 px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-medium shadow-md hover:bg-red-700 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <button className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-bold text-white flex items-center gap-2 mx-auto md:mx-0 shadow-lg hover:shadow-xl transition-all hover:scale-105">
              Start Free Trial{" "}
              <GiWeightLiftingUp className="text-xl sm:text-2xl" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          {/* Brand Section */}
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center gap-3">
              <GiGymBag className="text-3xl sm:text-4xl text-red-600" />
              <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                X FITNESS
              </h3>
            </div>
            <p className="text-xs sm:text-sm md:text-base leading-relaxed">
              Premier sports complex offering world-class facilities, expert
              coaching, and a community-driven approach to fitness excellence.
            </p>
            <div className="flex gap-4">
              <GiTrophyCup className="text-2xl sm:text-3xl text-red-600 hover:text-red-500 transition-colors" />
              <GiWeightLiftingUp className="text-2xl sm:text-3xl text-red-600 hover:text-red-500 transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4 sm:space-y-6">
            <h4 className="text-white text-lg sm:text-xl font-extrabold">
              Explore
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              {[
                { text: "Membership Plans", icon: <GiGymBag /> },
                { text: "Personal Training", icon: <GiWeightLiftingUp /> },
                { text: "Group Classes", icon: <GiTrophyCup /> },
                { text: "Sports Facilities", icon: <GiTrophyCup /> },
                { text: "Nutrition Guides", icon: <GiTrophyCup /> },
              ].map((item, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="flex items-center gap-2 text-xs sm:text-sm md:text-base hover:text-red-500 transition-colors"
                  >
                    {item.icon} {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4 sm:space-y-6">
            <h4 className="text-white text-lg sm:text-xl font-extrabold">
              Contact
            </h4>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start gap-3">
                <MdLocationOn className="text-red-600 text-lg sm:text-xl flex-shrink-0 mt-1" />
                <div>
                  <p className="font-medium text-xs sm:text-sm md:text-base">
                    Main Arena
                  </p>
                  <p className="text-xs sm:text-sm">
                    123 Fitness Road, Sport City
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MdPhone className="text-red-600 text-lg sm:text-xl" />
                <span className="text-xs sm:text-sm md:text-base">
                  +234 8119223162
                </span>
              </div>
              <div className="flex items-center gap-3">
                <MdEmail className="text-red-600 text-lg sm:text-xl" />
                <span className="text-xs sm:text-sm md:text-base">
                  train@Fitness.com
                </span>
              </div>
              <div className="flex items-center gap-3">
                <MdSchedule className="text-red-600 text-lg sm:text-xl" />
                <span className="text-xs sm:text-sm md:text-base">
                  Open 24/7
                </span>
              </div>
            </div>
          </div>

          {/* Social & Newsletter */}
          <div className="space-y-4 sm:space-y-6">
            <h4 className="text-white text-lg sm:text-xl font-extrabold">
              Connect
            </h4>
            <div className="flex gap-4 sm:gap-6">
              {[
                { icon: <FaFacebook />, color: "text-blue-600" },
                { icon: <FaInstagram />, color: "text-pink-600" },
                { icon: <FaTwitter />, color: "text-blue-400" },
                { icon: <FaYoutube />, color: "text-red-600" },
              ].map((social, index) => (
                <a
                  key={index}
                  href="#"
                  className={`text-xl sm:text-2xl hover:scale-125 transition-transform duration-200 ${social.color}`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
            <div className="space-y-3 sm:space-y-4">
              <p className="text-xs sm:text-sm md:text-base font-medium">
                Get Fitness Tips
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-gray-800 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm flex-grow focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6 text-center">
            <p className="text-xs sm:text-sm text-gray-400">
              © {new Date().getFullYear()} Admire Excellence Tech. All rights
              reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              {["Privacy Policy", "Terms", "FAQs", "Careers"].map(
                (item, index) => (
                  <a
                    key={index}
                    href="#"
                    className="text-xs sm:text-sm text-gray-400 hover:text-red-500 transition-colors"
                  >
                    {item}
                  </a>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
