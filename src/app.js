const express = require("express");
const cors = require("cors");
const { verifyAuth } = require("./middlewares/authMiddleware");

const app = express();

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
  }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", verifyAuth, require("./routes/users"));
app.use("/api/questions", verifyAuth, require("./routes/question"));
app.use("/api/answers", verifyAuth, require("./routes/answers"));
app.use("/api/reports", verifyAuth, require("./routes/reports"));

module.exports = app;