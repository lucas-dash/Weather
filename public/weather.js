var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//? Fetch data from API and Return filter data in object
export const getWeather = (lat, lon, timezone) => __awaiter(void 0, void 0, void 0, function* () {
    let endpoint = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,apparent_temperature,precipitation,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,precipitation_sum&current_weather=true&timeformat=unixtime&timezone=${timezone}`;
    try {
        const response = yield fetch(endpoint);
        if (response.ok) {
            const jsonResponse = yield response.json();
            // console.log(jsonResponse);
            return {
                current: filterCurrentData(jsonResponse),
                daily: filterDailyData(jsonResponse),
                hourly: filterHourlyData(jsonResponse),
            };
        }
    }
    catch (e) {
        console.log(e);
    }
});
function filterCurrentData({ current_weather, daily, }) {
    const { temperature: currentTemp, weathercode: iconCode, winddirection: windDirection, windspeed: windSpeed, } = current_weather;
    const { apparent_temperature_max: [maxFeelsLike], precipitation_sum: [precipitation], sunrise: [sunrise], sunset: [sunset], temperature_2m_max: [maxTemp], temperature_2m_min: [minTemp], } = daily;
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
function filterDailyData({ daily }) {
    return daily.time.map((time, index) => {
        return {
            timestamp: time * 1000,
            iconCode: daily.weathercode[index],
            maxTemp: Math.round(daily.temperature_2m_max[index]),
            minTemp: Math.round(daily.temperature_2m_min[index]),
        };
    });
}
function filterHourlyData({ current_weather, hourly }) {
    return hourly.time
        .map((time, index) => {
        return {
            timestamp: time * 1000,
            iconCode: hourly.weathercode[index],
            maxTemp: Math.round(hourly.temperature_2m[index]),
        };
    })
        .filter(({ timestamp }) => timestamp >= current_weather.time * 1000)
        .slice(0, 49);
}
