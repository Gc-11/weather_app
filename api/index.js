const express = require("express");
const axios = require("axios");

const path = require("path");

const app = express();

// ✅ Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ✅ EJS setup (FIXED PATH)
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "ejs");


app.get("/", (req, res) => {
  try {
    res.render("index", { weather: null });
  } catch (err) {
    console.log("Render error:", err.message);

    // fallback if EJS fails
    res.send("App is running but view failed ❌");
  }
});

app.post("/weather", async (req, res) => {
  const city = req.body.city;

  const apiKey = process.env.yourapikey;

  try {
    if (!apiKey) {
      return res.send("API key missing ❌");
    }

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`,
      { timeout: 5000 } // ✅ prevents timeout
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
    console.log(error.message);

    res.render("index", {
      weather: { error: "City not found ❌" }
    });
  }
});

module.exports = app;