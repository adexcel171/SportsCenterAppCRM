// Log to confirm this file is loaded
console.log("ASYNCHANDLER.JS LOADED -", new Date().toISOString());

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
