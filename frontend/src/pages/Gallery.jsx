import { motion } from "framer-motion";
import { MdOutlineSportsTennis } from "react-icons/md";
import { FaFutbol, FaBasketballBall } from "react-icons/fa";
import { GiGymBag } from "react-icons/gi";
import { useState } from "react";

const categories = [
  {
    name: "Tennis Courts",
    icon: <MdOutlineSportsTennis className="text-4xl text-red-500" />,
    description: "Professional-grade tennis courts with premium surfaces",
    images: [
      "https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?w=800&q=80",
      "https://images.unsplash.com/photo-1595435742656-5272d0b3fa82?w=800&q=80",
      "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&q=80",
      "https://images.unsplash.com/photo-1617883861744-411a7abd6bdb?w=800&q=80",
    ],
  },
  {
    name: "Soccer Fields",
    icon: <FaFutbol className="text-4xl text-green-500" />,
    description: "State-of-the-art soccer facilities for all skill levels",
    images: [
      "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800&q=80",
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80",
      "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800&q=80",
      "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&q=80",
    ],
  },
  {
    name: "Basketball Arenas",
    icon: <FaBasketballBall className="text-4xl text-orange-500" />,
    description: "Modern indoor and outdoor basketball courts",
    images: [
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80",
      "https://images.unsplash.com/photo-1608245449230-4ac19066d2d0?w=800&q=80",
      "https://images.unsplash.com/photo-1519766304817-4f37bda74a26?w=800&q=80",
      "https://images.unsplash.com/photo-1515523110800-9415d13b84a8?w=800&q=80",
    ],
  },
  {
    name: "Gym & Fitness",
    icon: <GiGymBag className="text-4xl text-yellow-500" />,
    description: "Fully equipped fitness center with latest equipment",
    images: [
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80",
      "https://images.unsplash.com/photo-1623874514711-0f321325f318?w=800&q=80",
      "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80",
    ],
  },
];

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white py-20 px-4 sm:px-6 lg:px-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-20"
      >
        <h1 className="text-5xl md:text-7xl font-black mb-4 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
          Our Facilities
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
          Explore our world-class sports and fitness facilities designed for
          champions
        </p>
      </motion.div>

      {/* Gallery Categories */}
      {categories.map((cat, idx) => (
        <motion.section
          key={idx}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: idx * 0.1 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-24"
        >
          {/* Category Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 pb-6 border-b border-gray-800">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              {cat.icon}
              <div>
                <h2 className="text-3xl md:text-4xl font-bold">{cat.name}</h2>
                <p className="text-gray-400 mt-1">{cat.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="px-3 py-1 bg-gray-800 rounded-full">
                {cat.images.length} Photos
              </span>
            </div>
          </div>

          {/* Image Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cat.images.map((src, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="relative overflow-hidden rounded-3xl shadow-2xl cursor-pointer group"
                onClick={() => setSelectedImage({ src, name: cat.name })}
              >
                <img
                  src={src}
                  alt={`${cat.name} ${i + 1}`}
                  className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-125"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-white text-lg font-bold drop-shadow-lg">
                      {cat.name}
                    </p>
                    <p className="text-gray-300 text-sm mt-1">View Details</p>
                  </div>
                </div>

                {/* Corner accent */}
                <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-white/30 rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.div>
            ))}
          </div>
        </motion.section>
      ))}

      {/* Lightbox Modal */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative max-w-6xl max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.src}
              alt={selectedImage.name}
              className="w-full h-full object-contain rounded-2xl"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              ✕
            </button>
            <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md px-6 py-3 rounded-full">
              <p className="text-white font-semibold">{selectedImage.name}</p>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Footer CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mt-32 pb-12"
      >
        <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
        <p className="text-gray-400 mb-8">
          Book your facility today and experience excellence
        </p>
        <button className="px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-orange-500/50 transform hover:scale-105 transition-all duration-300">
          Book Now
        </button>
      </motion.div>
    </div>
  );
};

export default Gallery;
