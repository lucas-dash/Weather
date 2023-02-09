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
    showCurrentWeather(current);
    showHourlyWeather(hourly);
    showDailyWeather(daily);
};
// ! current
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
// ! hourly
const showHourlyWeather = (hourlyWeather) => {
    const hourlySection = document.querySelector(".hourly-data");
    const hourlyTemplate = document.getElementById("hourly-template");
    const hourFormat = (time) => {
        return Number(Intl.DateTimeFormat(undefined, { hour: "numeric" }).format(time));
    };
    if (hourlySection) {
        hourlySection.innerHTML = "";
        hourlyWeather.forEach((hour) => {
            const { timestamp, maxTemp, iconCode } = hour;
            const template = hourlyTemplate.content.cloneNode(true);
            setChild("hourly", "time", hourFormat(timestamp), template);
            setChild("hourly", "maxTemp", maxTemp, template);
            setChild("hourly", "icon", getIconUrl(iconCode), template);
            hourlySection.appendChild(template);
        });
    }
};
// ! daily
const showDailyWeather = (dailyWeather) => {
    const dailySection = document.querySelector(".daily-data");
    const dailyTemplate = document.getElementById("daily-template");
    const weekFormat = Intl.DateTimeFormat(undefined, { weekday: "short" });
    if (dailySection) {
        dailySection.innerHTML = "";
        dailyWeather.forEach((oneDay) => {
            const { timestamp, iconCode, minTemp, maxTemp } = oneDay;
            const template = dailyTemplate.content.cloneNode(true);
            if (template) {
                const time = template.querySelector("[data-daily-time]");
                if (time) {
                    const day = weekFormat.format(timestamp);
                    const todayDay = new Intl.DateTimeFormat(undefined, {
                        weekday: "short",
                    }).format(new Date());
                    day === todayDay
                        ? (time.textContent = "Dnes")
                        : (time.textContent = day);
                }
                const lowTemp = template.querySelector("[data-daily-minTemp");
                if (lowTemp)
                    lowTemp.textContent = minTemp;
                const highTemp = template.querySelector("[data-daily-maxTemp");
                if (highTemp)
                    highTemp.textContent = maxTemp;
                const weatherIcon = template.querySelector("[data-daily-icon]");
                if (weatherIcon)
                    weatherIcon.src = getIconUrl(iconCode);
            }
            dailySection.appendChild(template);
        });
    }
};
//todo hourly time yet
// todo iterfaces
// todo wind direction
//todo hourly width
// todo connect setChild and setValue
function setChild(time, selector, value, parent) {
    const body = parent.querySelector(`[data-${time}-${selector}]`);
    if (body) {
        if (typeof value === "number" && body instanceof HTMLParagraphElement) {
            body.textContent = value.toString();
        }
        else if (typeof value === "string" && body instanceof HTMLImageElement) {
            body.src = value;
        }
    }
}
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
