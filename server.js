const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookiparser = require("cookie-parser");
dotenv.config();
const app = express();
app.use(express.json());
app.use(cookiparser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
const authroutes = require("./routes/authroutes");
app.use("/api/auth", authroutes);
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("mongodb is connected"))
  .catch((err) => console.log("this not connected", err));
const port = process.env.PORT || 3033;
app.listen(port, () => {
  console.log(`server running in http://localhost:${port}`);
});
