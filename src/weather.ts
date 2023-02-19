export interface CurrentWeather {
  currentTemp: number;
  highTemp: number;
  lowTemp: number;
  feelsLike: number;
  iconCode: number;
  precip: number;
  windSpeed: number;
  windDirection: number;
  sunIn: number;
  sunOut: number;
}
export interface DailyWeather {
  timestamp: number[];
  iconCode: number[];
  maxTemp: number[];
  minTemp: number[];
}
export interface HourlyWeather {
  timestamp: number[];
  iconCode: number[];
  maxTemp: number[];
}

export interface WeatherData {
  current: CurrentWeather;
  daily: DailyWeather;
  hourly: HourlyWeather;
}

//? Fetch data from API and Return filter data in object
export const getWeather = async (
  lat: number,
  lon: number,
  timezone: string
) => {
  let endpoint: string = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,apparent_temperature,precipitation,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,precipitation_sum&current_weather=true&timeformat=unixtime&timezone=${timezone}`;

  try {
    const response = await fetch(endpoint);
    if (response.ok) {
      const jsonResponse = await response.json();
      // console.log(jsonResponse);
      const anim = document.querySelectorAll('.animation');
      anim.forEach((x) => x.remove());
      const needleSpin = document.querySelector('#needle') as HTMLDivElement;
      needleSpin?.classList.remove('animate-spin');
      needleSpin?.classList.add('transform');
      return {
        current: filterCurrentData(jsonResponse),
        daily: filterDailyData(jsonResponse),
        hourly: filterHourlyData(jsonResponse),
      };
    }
  } catch (e) {
    console.log(e);
  }
};
interface JsonCurrentData {
  temperature: number;
  weathercode: number;
  winddirection: number;
  windspeed: number;
}
interface JsonDailyData {
  apparent_temperature_max: number[];
  precipitation_sum: number[];
  sunrise: number[];
  sunset: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
}

function filterCurrentData({
  current_weather,
  daily,
}: {
  current_weather: JsonCurrentData;
  daily: JsonDailyData;
}): CurrentWeather {
  const {
    temperature: currentTemp,
    weathercode: iconCode,
    winddirection: windDirection,
    windspeed: windSpeed,
  } = current_weather;

  const {
    apparent_temperature_max: [maxFeelsLike],
    precipitation_sum: [precipitation],
    sunrise: [sunrise],
    sunset: [sunset],
    temperature_2m_max: [maxTemp],
    temperature_2m_min: [minTemp],
  } = daily;

  return {
    currentTemp: Math.round(currentTemp),
    highTemp: Math.round(maxTemp),
    lowTemp: Math.round(minTemp),
    feelsLike: Math.round(maxFeelsLike),
    iconCode,
    precip: Math.round(precipitation),
    windSpeed: Math.round(windSpeed),
    windDirection,
    sunIn: sunrise,
    sunOut: sunset,
  };
}

function filterDailyData({ daily }: any): DailyWeather {
  return daily.time.map((time: number, index: number) => {
    return {
      timestamp: time * 1000,
      iconCode: daily.weathercode[index],
      maxTemp: Math.round(daily.temperature_2m_max[index]),
      minTemp: Math.round(daily.temperature_2m_min[index]),
    };
  });
}

function filterHourlyData({ current_weather, hourly }: any): HourlyWeather {
  return hourly.time
    .map((time: number, index: number) => {
      return {
        timestamp: time * 1000,
        iconCode: hourly.weathercode[index],
        maxTemp: Math.round(hourly.temperature_2m[index]),
      };
    })
    .filter(({ timestamp }: any) => timestamp >= current_weather.time * 1000)
    .slice(0, 49);
}
