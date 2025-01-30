import React from "react";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { GiGymBag, GiTrophyCup, GiWeightLiftingUp } from "react-icons/gi";
import { MdEmail, MdLocationOn, MdPhone, MdSchedule } from "react-icons/md";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* CTA Section */}
      <div className="bg-gradient-to-r from-gray-800 to-red-900 py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://example.com/gym-floor.jpg')] bg-cover opacity-10" />
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-left">
              <h2 className="text-4xl font-black mb-4 text-white">
                Transform Your Body <br />
                <span className="text-red-500">Today</span>
              </h2>
              <div className="flex gap-4 mb-6">
                <span className="bg-red-600 px-4 py-1 rounded-full text-sm">
                  24/7 Access
                </span>
                <span className="bg-red-600 px-4 py-1 rounded-full text-sm">
                  Free Trial
                </span>
                <span className="bg-red-600 px-4 py-1 rounded-full text-sm">
                  Expert Coaches
                </span>
              </div>
            </div>
            <button className="bg-red-600 hover:bg-red-700 px-12 py-4 rounded-xl text-lg font-bold flex items-center gap-2 transition-transform hover:scale-105">
              Start Free Trial <GiWeightLiftingUp className="text-2xl" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <GiGymBag className="text-4xl text-red-600" />
              <h3 className="text-2xl font-black text-white">D'PLAYCE</h3>
            </div>
            <p className="text-sm leading-relaxed">
              Premier sports complex offering world-class facilities, expert
              coaching, and a community-driven approach to fitness excellence.
            </p>
            <div className="flex gap-4 mt-4">
              <GiTrophyCup className="text-3xl text-red-600" />
              <GiWeightLiftingUp className="text-3xl text-red-600" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-white text-lg font-black">Explore</h4>
            <ul className="space-y-3">
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
                    className="flex items-center gap-2 text-sm hover:text-red-500 transition-colors"
                  >
                    {item.icon} {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="text-white text-lg font-black">Contact</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MdLocationOn className="text-red-600 text-xl" />
                <div>
                  <p className="font-medium">Main Arena</p>
                  <p className="text-sm">123 Fitness Road, Sport City</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MdPhone className="text-red-600 text-xl" />
                <span className="text-sm">(234) 567-8900</span>
              </div>
              <div className="flex items-center gap-3">
                <MdEmail className="text-red-600 text-xl" />
                <span className="text-sm">train@dplayce.com</span>
              </div>
              <div className="flex items-center gap-3">
                <MdSchedule className="text-red-600 text-xl" />
                <span className="text-sm">Open 24/7</span>
              </div>
            </div>
          </div>

          {/* Social & Newsletter */}
          <div className="space-y-6">
            <h4 className="text-white text-lg font-black">Connect</h4>
            <div className="flex gap-4">
              {[
                { icon: <FaFacebook />, color: "text-blue-600" },
                { icon: <FaInstagram />, color: "text-pink-600" },
                { icon: <FaTwitter />, color: "text-blue-400" },
                { icon: <FaYoutube />, color: "text-red-600" },
              ].map((social, index) => (
                <a
                  key={index}
                  href="#"
                  className={`text-2xl hover:scale-125 transition-transform ${social.color}`}
                >
                  {social.icon}
                </a>
              ))}
            </div>

            <div className="space-y-4">
              <p className="text-sm font-medium">Get Fitness Tips</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-gray-800 rounded-lg px-4 py-3 text-sm flex-grow focus:outline-none focus:ring-2 focus:ring-red-600"
                />
                <button className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg text-sm font-bold transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center">
            <p className="text-sm text-gray-400">
              © 2024 D'PLAYCE. All rights reserved.
            </p>
            <div className="flex gap-6">
              {["Privacy Policy", "Terms", "FAQs", "Careers"].map(
                (item, index) => (
                  <a
                    key={index}
                    href="#"
                    className="text-sm text-gray-400 hover:text-red-500 transition-colors"
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
