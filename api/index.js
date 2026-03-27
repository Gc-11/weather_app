const express = require("express");
const axios = require("axios");
const serverless = require("serverless-http");
const path = require("path");

const app = express();

// ✅ Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ✅ EJS setup (VERY IMPORTANT)
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "ejs");

// ✅ TEST ROUTE (to debug Vercel)
app.get("/test", (req, res) => {
  res.send("Vercel working ✅");
});

// ✅ Home route
app.get("/", (req, res) => {
  res.render("index", { weather: null });
});

// ✅ Weather route
app.post("/weather", async (req, res) => {
  const city = req.body.city;

  // ✅ FIXED ENV VARIABLE
  const apiKey = process.env.yourapikey;

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
    );

    const tomorrow = response.data.list[8];

    const temp = tomorrow.main.temp;
    const condition = tomorrow.weather[0].description;

    const willRain = condition.includes("rain") ? "Yes 🌧️" : "No ☀️";

    res.render("index", {
      weather: {
        city,
        temp,
        condition,
        willRain
      }
    });

  } catch (error) {
    console.log(error.message); // debug
    res.render("index", {
      weather: { error: "City not found ❌" }
    });
  }
});

module.exports = serverless(app);