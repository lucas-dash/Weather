import { getWeather } from "./weather.js";
import { iconMap } from "./iconWeather.js";
import {
  WeatherData,
  CurrentWeather,
  DailyWeather,
  HourlyWeather,
} from "./weather.js";

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition((position) => {
    let lat: number = position.coords.latitude;
    let lon: number = position.coords.longitude;
    let timezone: string = Intl.DateTimeFormat().resolvedOptions().timeZone;

    getWeather(lat, lon, timezone)
      .then(getCurrentWeather)
      .catch((e) => {
        console.log(e);
        throw new Error("Failed to load weather");
      });
  });
}
// ? getting current weather for now hour and day
const getCurrentWeather = ({ current, daily, hourly }: any) => {
  console.log(daily);
  showCurrentWeather(current);
  showDailyWeather(daily);
};

type Heading = HTMLHeadingElement;

function setValue(time: string, selector: string, value: any): void {
  const head = document.querySelector<Heading>(`[data-${time}-${selector}]`);
  if (head) {
    head.textContent = value;
  }
}

function convertToTime(value: number): string {
  const time = new Date(value * 1000).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  return time;
}

function getIconUrl(iconCode: number): string {
  return `icons/vuesax/linear/${iconMap.get(iconCode)}.svg`;
}

const showCurrentWeather = (currentWeather: CurrentWeather): void => {
  const {
    currentTemp,
    feelsLike,
    highTemp,
    lowTemp,
    iconCode,
    precip,
    sunIn,
    sunOut,
    windDirection,
    windSpeed,
  }: CurrentWeather = currentWeather;

  const weatherIcon = document.querySelector<HTMLImageElement>(
    "[data-current-icon]"
  );

  if (weatherIcon) weatherIcon.src = getIconUrl(iconCode);

  setValue("current", "temp", currentTemp);
  setValue("current", "maxTemp", highTemp);
  setValue("current", "minTemp", lowTemp);
  setValue("current", "sunrise", convertToTime(sunIn));
  setValue("current", "sunset", convertToTime(sunOut));
  setValue("current", "precip", precip);
  setValue("current", "windspeed", windSpeed);
  setValue("apparent", "temp", feelsLike);
};

const showDailyWeather = (dailyWeather: DailyWeather): void => {};
