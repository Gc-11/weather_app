const express = require("express");
const axios = require("axios");
const serverless = require("serverless-http");

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Test route
app.get("/test", (req, res) => {
  res.send("Vercel working ✅");
});

// Home page
app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Rain Prediction App</title>
        <style>
          body {
            font-family: Arial;
            background: linear-gradient(to bottom, #4facfe, #00f2fe);
            text-align: center;
            padding-top: 100px;
            color: white;
          }
          .card {
            background: rgba(255,255,255,0.2);
            padding: 20px;
            border-radius: 15px;
            width: 300px;
            margin: auto;
          }
          input, button {
            padding: 10px;
            margin: 5px;
            border-radius: 5px;
            border: none;
          }
          button {
            background: #007bff;
            color: white;
            cursor: pointer;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>🌧️ Rain Prediction</h1>
          <form method="POST" action="/weather">
            <input name="city" placeholder="Enter city" required />
            <br/>
            <button type="submit">Check Weather</button>
          </form>
        </div>
      </body>
    </html>
  `);
});

// Weather route
app.post("/weather", async (req, res) => {
  const city = req.body.city;

  // ✅ FIXED ENV VARIABLE NAME
  const apiKey = process.env.yourapikey;

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
    );

    const tomorrow = response.data.list[8];
    const temp = tomorrow.main.temp;
    const condition = tomorrow.weather[0].description;
    const willRain = condition.includes("rain") ? "Yes 🌧️" : "No ☀️";

    res.send(`
      <html>
        <head>
          <style>
            body {
              font-family: Arial;
              background: linear-gradient(to bottom, #4facfe, #00f2fe);
              text-align: center;
              padding-top: 100px;
              color: white;
            }
            .card {
              background: rgba(255,255,255,0.2);
              padding: 20px;
              border-radius: 15px;
              width: 300px;
              margin: auto;
            }
            a {
              color: white;
              text-decoration: underline;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <h2>${city}</h2>
            <p>🌡️ ${temp}°C</p>
            <p>☁️ ${condition}</p>
            <h3>Will it rain tomorrow?</h3>
            <h2>${willRain}</h2>
            <br/>
            <a href="/">⬅ Go Back</a>
          </div>
        </body>
      </html>
    `);

  } catch (error) {
    res.send(`
      <h2>City not found ❌</h2>
      <a href="/">Go Back</a>
    `);
  }
});

// Export for Vercel
module.exports = serverless(app);