const path = require("path");
require("dotenv").config();
const express = require("express");
const compression = require("compression");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const bodyParser = require("body-parser");
var cors = require("cors");
const cookieParser = require("cookie-parser");
const { default: mongoose } = require("mongoose");

const app = express();

app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*", // Địa chỉ của React app
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use("/assets", express.static(path.join(__dirname, "../public/assets")));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
    limit: "30mb",
  })
);

app.use(cookieParser());

// init middlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());

// init db

const urlDB = 'mongodb+srv://girllinh4:hrQdehoMFZc1abV8@cluster0.9gulfoc.mongodb.net/?retryWrites=true&w=majority'
const urlLocalhost = 'mongodb://localhost:27017/hung'
mongoose
  .connect(urlDB)
  .then(() => console.log("Success"))
  .catch((err) => console.log("erre", err));

// router
app.get("/ping", (req, res) => {
  res.json({
    message: "PONG PONG",
  });
});

app.use("/v1/api", require("./routes"));

app.use((req, res, next) => {
  const error = new Error("Not found!");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    message: error.message || "Internal Server Error",
    // stack: error.stack,
  });
});

module.exports = app;
