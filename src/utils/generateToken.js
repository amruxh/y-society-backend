const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  return token;
};

module.exports = generateToken;