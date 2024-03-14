import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "100d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: false, // Set to false during development
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
  

  return token;
};

export default generateToken;
