import { getWeather } from "./weather.js";
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
  console.log(current);
  showCurrentWeather(current);
};

type Heading = HTMLHeadingElement;

const showCurrentWeather = (currentWeather: CurrentWeather): void => {
  const head = document.querySelector<Heading>("[data-current-temp]");
  if (head) head.textContent = `${currentWeather.currentTemp}`;
};
