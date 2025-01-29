import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* CTA Banner */}
      <div className="bg-blue-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">
                Start Your Fitness Journey Today!
              </h2>
              <p className="mb-6">
                Get 25% off your first month when you join D Playce Sports
                Center.
              </p>
              <button className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold flex items-center gap-2 hover:bg-gray-100 transition-colors">
                Join Now <ArrowRight size={20} />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-700 p-4 rounded-lg text-center">
                <p className="text-sm font-medium">Modern Equipment</p>
              </div>
              <div className="bg-blue-700 p-4 rounded-lg text-center">
                <p className="text-sm font-medium">Expert Trainers</p>
              </div>
              <div className="bg-blue-700 p-4 rounded-lg text-center">
                <p className="text-sm font-medium">Group Classes</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <div className="mb-4">
              <img
                src="/api/placeholder/200/80"
                alt="D Playce Logo"
                className="h-12"
              />
            </div>
            <p className="text-sm mb-4">
              D Playce is more than just a gym - it's a community dedicated to
              helping you achieve your fitness goals in a motivating and
              supportive environment.
            </p>
            <div className="flex gap-4 mt-4">
              <span className="bg-blue-600 px-3 py-1 rounded-full text-xs font-medium">
                24/7 Access
              </span>
              <span className="bg-blue-600 px-3 py-1 rounded-full text-xs font-medium">
                Free Parking
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-lg font-bold mb-4">Our Services</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-sm hover:text-white transition-colors flex items-center gap-2"
                >
                  <ArrowRight size={16} />
                  Gym & Fitness
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm hover:text-white transition-colors flex items-center gap-2"
                >
                  Group Classes
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm hover:text-white transition-colors flex items-center gap-2"
                >
                  Personal Training
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm hover:text-white transition-colors flex items-center gap-2"
                >
                  Sports Courts
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm hover:text-white transition-colors flex items-center gap-2"
                >
                  <ArrowRight size={16} />
                  Nutrition Planning
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white text-lg font-bold mb-4">Visit Us</h4>
            <div className="space-y-4">
              <div className="p-4 bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-white">
                    Main Location
                  </span>
                </div>
                <p className="text-sm">123 Fitness Street, Sportstown</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm">(555) 123-4567</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">info@dplayce.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Open 24/7</span>
                </div>
              </div>
            </div>
          </div>

          {/* Social Media & Newsletter */}
          <div>
            <h4 className="text-white text-lg font-bold mb-4">
              Stay Connected
            </h4>
            <div className="mb-6">
              <p className="text-sm mb-4">
                Follow us for fitness tips and updates!
              </p>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="bg-gray-800 p-2 rounded-full hover:bg-blue-600 transition-colors"
                ></a>
                <a
                  href="#"
                  className="bg-gray-800 p-2 rounded-full hover:bg-blue-600 transition-colors"
                ></a>
                <a
                  href="#"
                  className="bg-gray-800 p-2 rounded-full hover:bg-blue-600 transition-colors"
                ></a>
                <a
                  href="#"
                  className="bg-gray-800 p-2 rounded-full hover:bg-blue-600 transition-colors"
                ></a>
              </div>
            </div>
            <div>
              <p className="text-sm mb-2">Subscribe to our newsletter</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="bg-gray-800 rounded px-3 py-2 text-sm flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="bg-blue-600 px-4 py-2 rounded text-white text-sm hover:bg-blue-700 transition-colors">
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">
              © 2025 D Playce Sports Center. All rights reserved.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-sm hover:text-white transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-sm hover:text-white transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-sm hover:text-white transition-colors"
              >
                Membership Agreement
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
