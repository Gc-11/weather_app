const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");


app.get("/", (req, res) => {
  res.render("index", { weather: null });
});


app.post("/weather", async (req, res) => {
  const city = req.body.city;
  const apiKey = process.env.yourapiKey;

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
    res.render("index", { weather: { error: "City not found ❌" } });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});