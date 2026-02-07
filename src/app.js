const express = require("express");
const cors = require("cors");
const { verifyAuth } = require("./middlewares/authMiddleware");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", verifyAuth, require("./routes/users"));
app.use("/api/questions", verifyAuth, require("./routes/question"));
app.use("/api/answers", verifyAuth, require("./routes/answers"));

module.exports = app;