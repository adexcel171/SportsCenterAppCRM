import "./loader.css";
const Loader = () => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center space-y-4">
        {/* Multi-color gradient spinner with dynamic scaling */}
        <div
          className="animate-spin rounded-full h-16 w-16 border-[3px] border-t-transparent border-r-transparent"
          style={{
            backgroundImage:
              "conic-gradient(from 180deg at 50% 50%, #6366f1 0deg, #ec4899 180deg, rgba(255,255,255,0) 360deg)",
            WebkitMask:
              "radial-gradient(farthest-side, rgba(0,0,0,0) 85%, #000 87%)",
            mask: "radial-gradient(farthest-side, rgba(0,0,0,0) 85%, #000 87%)",
          }}
          role="status"
          aria-label="Loading"
        ></div>

        {/* Animated text with fade effect */}
        <p className="text-gray-600 font-medium animate-pulse">
          Loading Products...
          <span className="ml-2 text-xs text-gray-400">(Please wait)</span>
        </p>

        {/* Progress indicator */}
        <div className="h-1 w-48 mx-auto bg-gray-200 rounded-full">
          <div className="animate-progress h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
