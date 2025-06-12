import jwt from "jsonwebtoken";

// Log to confirm this file is loaded
console.log(
  "CREATETOKEN.JS LOADED - TOKEN_ONLY_FIX -",
  new Date().toISOString()
);

const generateToken = (userId) => {
  console.log(
    "GENERATETOKEN EXECUTED - UserID:",
    userId,
    "-",
    new Date().toISOString()
  );
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "100d",
  });
  return token;
};

export default generateToken;
