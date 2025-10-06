const apiKey = "9edab4ce34ff48d4ab1152759250410";
const resultDiv = document.getElementById("weatherResult");
const searchBtn = document.getElementById("searchBtn");
const themeToggle = document.getElementById("themeToggle");

// Fetch weather data from API
async function getWeather(location) {
  try {
    const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}&aqi=yes`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("City not found");

    const data = await res.json();
    displayWeather(data);
  } catch (err) {
    resultDiv.innerHTML = `<p style="color: red;">❌ ${err.message}</p>`;
  }
}

// Display weather data on UI
function displayWeather(data) {
  resultDiv.innerHTML = `
    <h2>${data.location.name}, ${data.location.country}</h2>
    <img src="https:${data.current.condition.icon}" alt="Weather Icon" />
    <div class="temperature">${data.current.temp_c}°C</div>
    <p>${data.current.condition.text}</p>
    <div class="details">
      <div class="detail-box">💨 Wind: ${data.current.wind_kph} kph</div>
      <div class="detail-box">💧 Humidity: ${data.current.humidity}%</div>
      <div class="detail-box">🌡️ Feels Like: ${data.current.feelslike_c}°C</div>
      <div class="detail-box">🌍 AQI: ${data.current.air_quality["pm2_5"].toFixed(1)} µg/m³</div>
    </div>
  `;
}

// Search button event
searchBtn.addEventListener("click", () => {
  const location = document.getElementById("locationInput").value.trim();
  if (!location) {
    resultDiv.innerHTML = `<p>Please enter a location ❗</p>`;
    return;
  }
  resultDiv.innerHTML = `<p>⏳ Fetching weather data...</p>`;
  getWeather(location);
});

// Enter key triggers search
document.getElementById("locationInput").addEventListener("keypress", (e) => {
  if (e.key === "Enter") searchBtn.click();
});

// Theme toggle
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  document.body.classList.toggle("light");
  themeToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
});
