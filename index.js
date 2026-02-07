const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT ?? 8000;

connectDB();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send("Server is running");
});

app.use('/api/questions', require('./routes/question'));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});