import { getWeather } from "./weather.js";
import { iconMap } from "./iconWeather.js";
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
    console.log(daily);
    showCurrentWeather(current);
    showDailyWeather(daily);
};
function setValue(time, selector, value) {
    const head = document.querySelector(`[data-${time}-${selector}]`);
    if (head) {
        head.textContent = value;
    }
}
function convertToTime(value) {
    const time = new Date(value * 1000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });
    return time;
}
function getIconUrl(iconCode) {
    return `icons/vuesax/linear/${iconMap.get(iconCode)}.svg`;
}
const showCurrentWeather = (currentWeather) => {
    const { currentTemp, feelsLike, highTemp, lowTemp, iconCode, precip, sunIn, sunOut, windDirection, windSpeed, } = currentWeather;
    const weatherIcon = document.querySelector("[data-current-icon]");
    if (weatherIcon)
        weatherIcon.src = getIconUrl(iconCode);
    setValue("current", "temp", currentTemp);
    setValue("current", "maxTemp", highTemp);
    setValue("current", "minTemp", lowTemp);
    setValue("current", "sunrise", convertToTime(sunIn));
    setValue("current", "sunset", convertToTime(sunOut));
    setValue("current", "precip", precip);
    setValue("current", "windspeed", windSpeed);
    setValue("apparent", "temp", feelsLike);
};
const showDailyWeather = (dailyWeather) => { };
