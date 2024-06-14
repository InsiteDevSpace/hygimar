import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader;

  if (!token) {
    console.log("Authorization token is missing");
    return res.status(401).json({ msg: "Unauthorized: Token is missing" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log("Token verification failed:", err.message);
      return res
        .status(403)
        .json({ msg: "Forbidden: Token is invalid or expired" });
    }
    req.user = user;
    next();
  });
};
