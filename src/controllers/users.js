const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find().select("-email -password -__v -createdAt -updatedAt -role");
    res.json(allUsers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).select("-email -password -__v -createdAt -updatedAt -role");
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.getUserByEmail = async (req, res) => {
    try {
        const userEmail = req.params.email;
        const user = await User.findOne({ email: userEmail });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getMe = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const me = await User.findById(decoded.id);
        res.json(me);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
