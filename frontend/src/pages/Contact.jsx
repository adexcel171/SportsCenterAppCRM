import React from "react";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Contact = () => {
  return (
    <section className="bg-gray-100 py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
          Contact Us
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold mb-6">Get in Touch</h3>
            <div className="space-y-6">
              {/* Address */}
              <div className="flex items-center">
                <FaMapMarkerAlt className="text-red-500 mr-4" size={24} />
                <div>
                  <p className="font-semibold">Address</p>
                  <p>Kuduru Road, Bwari, Abuja, Nigeria</p>
                </div>
              </div>
              {/* Phone */}
              <div className="flex items-center">
                <FaPhone className="text-red-500 mr-4" size={24} />
                <div>
                  <p className="font-semibold">Phone</p>
                  <p>+234 123 456 7890</p>
                </div>
              </div>
              {/* Email */}
              <div className="flex items-center">
                <FaEnvelope className="text-red-500 mr-4" size={24} />
                <div>
                  <p className="font-semibold">Email</p>
                  <p>info@sportscenter.com</p>
                </div>
              </div>
              {/* Social Media Links */}
              <div className="flex space-x-6 mt-6">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 transition-all"
                >
                  <FaFacebook size={28} />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-600 transition-all"
                >
                  <FaTwitter size={28} />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-500 hover:text-pink-700 transition-all"
                >
                  <FaInstagram size={28} />
                </a>
              </div>
            </div>
          </div>

          {/* Google Map Embed */}
          <div className="rounded-lg overflow-hidden shadow-lg">
            <iframe
              title="Sports Center Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.123456789012!2d7.384556415734123!3d9.123456789012345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOcKwMDcnMjQuNCJOIDfCsDIzJzA0LjgiRQ!5e0!3m2!1sen!2sng!4v1234567890123!5m2!1sen!2sng"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
