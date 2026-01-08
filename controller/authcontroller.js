const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Fix: correct function name and expiresIn
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_KEY, { expiresIn: "1d" });
};

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Please fill all fields" });

    const existUser = await User.findOne({ email });
    if (existUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword });

    const token = createToken(user._id);
    res.cookie("token", token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });

    res.json({
      message: "Register completed",
      user: { id: user._id, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = createToken(user._id);
    res.cookie("token", token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });

    res.json({
      message: "Login completed",
      user: { id: user._id, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.currentuser = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Not authorized" });

    const decode = jwt.verify(token, process.env.JWT_KEY);
    const user = await User.findById(decode.id).select("-password");

    res.json(user);
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
