const jwt = require("jsonwebtoken");
const User = require("../models/user");
const authmiddileware = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "token missing" });
    }
    const decode = jwt.verify(token, process.env.JWT_KEY);
    const user = await User.findById(decode.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "user not foundḍ" });
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "user not authoraized" });
  }
};
module.exports = authmiddileware;
