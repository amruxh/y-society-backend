const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find().select("-email -password -__v -createdAt -updatedAt -role -saved");
    res.json(allUsers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).select("-email -password -__v -createdAt -updatedAt -role -saved");
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


exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // whitelist fields
    const allowedUpdates = ["full_name", "phone", "profile_pic", "bio"];
    const updates = {};

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true, context: "query" }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);

  } catch (err) {
    console.error("UPDATE PROFILE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};



exports.deleteProfile = (req, res) => {
    try {
        const userId = req.user.id;
        User.findByIdAndDelete(userId);
        res.json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}  