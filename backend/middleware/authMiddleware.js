const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    // 1️⃣ Get token from header
    const token = req.header("Authorization");

    if (!token) {
      return res.status(401).json("No token, access denied");
    }

    // 2️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3️⃣ Attach user info to request
    req.user = decoded;

    next(); // move to next function

  } catch (error) {
    res.status(401).json("Invalid token");
  }
};

module.exports = authMiddleware;