const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
require("dotenv").config();
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

app.use(express.json());



// 221457
// prod_commerce

// mongodb code here





app.get("/", (req, res) => {
    res.send("prod_Commerce is running HERE!");
  });
  app.listen(port, (req, res) => {
    console.log(`server running on port ${port}`);
  });
