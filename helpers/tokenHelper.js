import jwt from "jsonwebtoken";

export const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid token");
  }
}; 