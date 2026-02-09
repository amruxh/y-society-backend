const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  getUserByEmail,
  getMe,
  updateProfile,
  deleteProfile,
} = require("../controllers/users");

router.get("/", getAllUsers);
router.get("/id/:id", getUserById);
router.get("/email/:email", getUserByEmail);
router.get("/me", getMe);
router.put("/me", updateProfile);
router.delete("/me", deleteProfile);

module.exports = router;