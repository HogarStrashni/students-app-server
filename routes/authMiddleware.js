const jwt = require("jsonwebtoken");
const User = require("../model/user");

const authProtect = async (req, res, next) => {
  let token;
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      // Get token
      token = req.headers.authorization.split(" ")[1];
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      //GET user form the token
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } else {
      throw new Error("Not authorized!");
    }

    if (!token) {
      throw new Error("Not authorized! No token!");
    }
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

const authAdmin = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.decode(token);
  try {
    if (decoded.payload.role !== "admin") {
      throw new Error("Not authorized!");
    }
  } catch (err) {
    res.status(403).json({ message: err.message });
  }

  next();
};

module.exports = { authProtect, authAdmin };
