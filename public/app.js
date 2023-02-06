import { getWeather } from "./weather.js";
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;
        let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        getWeather(lat, lon, timezone)
            .then(getCurrentWeather)
            .catch((e) => {
            console.log(e);
            throw new Error("Failed to load weather");
        });
    });
}
// ? getting current weather for now hour and day
const getCurrentWeather = ({ current, daily, hourly }) => {
    console.log(current);
    showCurrentWeather(current);
};
const showCurrentWeather = (currentWeather) => {
    const head = document.querySelector("[data-current-temp]");
    if (head)
        head.textContent = `${currentWeather.currentTemp}`;
};
