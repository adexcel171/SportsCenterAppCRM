import { motion } from "framer-motion";
import { MdOutlineSportsTennis } from "react-icons/md";
import { FaFutbol, FaBasketballBall } from "react-icons/fa";
import { GiGymBag } from "react-icons/gi";

const categories = [
  {
    name: "Tennis Courts",
    icon: <MdOutlineSportsTennis className="text-3xl text-red-500" />,
    images: [
      "https://images.unsplash.com/photo-1505664194779-8beaceb93744",
      "https://images.unsplash.com/photo-1502877338535-766e1452684a",
      "https://images.unsplash.com/photo-1521412644187-c49fa049e84d",
      "https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf",
    ],
    videos: ["https://www.w3schools.com/html/mov_bbb.mp4"],
  },
  {
    name: "Soccer Fields",
    icon: <FaFutbol className="text-3xl text-green-500" />,
    images: [
      "https://images.unsplash.com/photo-1521412644187-c49fa049e84d",
      "https://images.unsplash.com/photo-1502877338535-766e1452684a",
      "https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf",
      "https://images.unsplash.com/photo-1606112219348-204d7d8b94ee",
    ],
    videos: ["https://www.w3schools.com/html/movie.mp4"],
  },
  {
    name: "Basketball Arenas",
    icon: <FaBasketballBall className="text-3xl text-orange-500" />,
    images: [
      "https://images.unsplash.com/photo-1517649763962-0c623066013b",
      "https://images.unsplash.com/photo-1575379894912-7c67f97a3e48",
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537",
      "https://images.unsplash.com/photo-1584466977773-3440c30973a2",
    ],
    videos: [],
  },
  {
    name: "Gym & Fitness",
    icon: <GiGymBag className="text-3xl text-yellow-500" />,
    images: [
      "https://images.unsplash.com/photo-1558611848-73f7eb4001a1",
      "https://images.unsplash.com/photo-1594737625785-c0e58c9f93a0",
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48",
      "https://images.unsplash.com/photo-1599058917212-d750089bc63d",
    ],
    videos: [],
  },
];

const Gallery = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-white py-16 px-4 sm:px-6 lg:px-12">
      <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-12">
        Fitness Center Gallery
      </h1>

      {categories.map((cat, idx) => (
        <motion.section
          key={idx}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          {/* Title */}
          <div className="flex items-center gap-3 mb-6">
            {cat.icon}
            <h2 className="text-2xl md:text-3xl font-bold">{cat.name}</h2>
          </div>

          {/* Images */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
            {cat.images.map((src, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl group"
              >
                <img
                  src={`${src}?auto=format&fit=crop&w=800&q=80`}
                  alt={`${cat.name} ${i}`}
                  className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                  <span className="text-white text-lg font-semibold drop-shadow-lg">
                    {cat.name}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Videos */}
          {cat.videos.length > 0 && (
            <div>
              <h3 className="text-xl md:text-2xl font-semibold mb-4">
                Highlights
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {cat.videos.map((src, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.03 }}
                    className="overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl"
                  >
                    <video
                      src={src}
                      controls
                      className="w-full aspect-video object-cover rounded-2xl"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.section>
      ))}
    </div>
  );
};

export default Gallery;
