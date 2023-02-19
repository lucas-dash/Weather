import { getWeather } from './weather.js';
import { iconMap } from './iconWeather.js';
import { CurrentWeather } from './weather.js';

type Template = HTMLTemplateElement;
type Heading = HTMLHeadingElement;

const defaultLat = 50.43;
const defaultLon = 14.21;
const defaultTimezone = 'Prague/Europe';

// ? getting current weather for now hour and day
const getCurrentWeather = ({ current, daily, hourly }: any): void => {
  showCurrentWeather(current);
  showHourlyWeather(hourly);
  showDailyWeather(daily);
};

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      let lat = position.coords.latitude;
      let lon = position.coords.longitude;
      let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      getWeather(lat, lon, timezone)
        .then(getCurrentWeather)
        .catch((e) => {
          console.log(e);
          throw new Error('Failed load weather');
        });
    },
    (error) => {
      // if geolocation fails, use default values
      let lat = defaultLat;
      let lon = defaultLon;
      let timezone = defaultTimezone;

      getWeather(lat, lon, timezone)
        .then(getCurrentWeather)
        .catch((e) => {
          throw new Error('Failed to load weather');
        });
    }
  );
} else {
  // if geolocation not supported
  alert('Zapni polohové služby!');
  let lat = defaultLat;
  let lon = defaultLon;
  let timezone = defaultTimezone;

  getWeather(lat, lon, timezone)
    .then(getCurrentWeather)
    .catch((e) => {
      throw new Error('Failed to load weather');
    });
}

// ! current
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
    '[data-current-icon]'
  );
  if (weatherIcon) weatherIcon.src = getIconUrl(iconCode);

  const needle = document.querySelector(
    '[data-current-winddirection]'
  ) as HTMLDivElement;

  function rotateNeedle(degrees: number): void {
    needle.style.transform = `rotate(-${degrees}deg)`;
  }

  rotateNeedle(windDirection);
  setValue('current', 'temp', currentTemp);
  setValue('current', 'maxTemp', highTemp);
  setValue('current', 'minTemp', lowTemp);
  setValue('current', 'sunrise', convertToTime(sunIn));
  setValue('current', 'sunset', convertToTime(sunOut));
  setValue('current', 'precip', precip);
  setValue('current', 'windspeed', windSpeed);
  setValue('apparent', 'temp', feelsLike);
};

// ! hourly
const showHourlyWeather = (hourlyWeather: any): void => {
  const hourlySection = document.querySelector(
    '.hourly-data'
  ) as HTMLDivElement;
  const hourlyTemplate = document.getElementById('hourly-template') as Template;

  let executed = false;
  const hourFormat = (time: number): any => {
    const convert = Number(
      Intl.DateTimeFormat(undefined, { hour: 'numeric' }).format(time)
    );

    if (!executed) {
      executed = true;
      return 'Teď';
    } else {
      return convert;
    }
  };

  if (hourlySection) {
    hourlyWeather.forEach((hour: any) => {
      const { timestamp, maxTemp, iconCode } = hour;

      const template = hourlyTemplate.content.cloneNode(true) as Template;

      const time = template.querySelector(
        '[data-hourly-time]'
      ) as HTMLParagraphElement;
      if (time) {
        time.textContent = hourFormat(timestamp);
      }

      setTemplateChild('hourly', 'maxTemp', maxTemp, template);
      setTemplateChild('hourly', 'icon', getIconUrl(iconCode), template);

      hourlySection.appendChild(template);
    });
  }
};
// ! daily
const showDailyWeather = (dailyWeather: []): void => {
  const dailySection = document.querySelector('.daily-data') as HTMLDivElement;
  const dailyTemplate = document.getElementById(
    'daily-template'
  ) as HTMLTemplateElement;
  const weekFormat = Intl.DateTimeFormat(undefined, { weekday: 'short' });

  if (dailySection) {
    dailyWeather.forEach((oneDay) => {
      const { timestamp, iconCode, minTemp, maxTemp } = oneDay;
      const template = dailyTemplate.content.cloneNode(
        true
      ) as HTMLTemplateElement;

      if (dailySection) {
        const time = template.querySelector('[data-daily-time]');
        if (time) {
          const day = weekFormat.format(timestamp);
          const todayDay = new Intl.DateTimeFormat(undefined, {
            weekday: 'short',
          }).format(new Date());

          day === todayDay
            ? (time.textContent = 'Dnes')
            : (time.textContent = day);
        }
        setTemplateChild('daily', 'minTemp', minTemp, template);
        setTemplateChild('daily', 'maxTemp', maxTemp, template);
        setTemplateChild('daily', 'icon', getIconUrl(iconCode), template);
      }

      dailySection.appendChild(template);
    });
  }
};

function setTemplateChild(
  time: string,
  selector: string,
  value: number | string,
  parent: Template
): void {
  const body = parent.querySelector(`[data-${time}-${selector}]`) as
    | HTMLImageElement
    | HTMLParagraphElement;
  if (body) {
    if (typeof value === 'number' && body instanceof HTMLParagraphElement) {
      body.textContent = value.toString();
    } else if (typeof value === 'string' && body instanceof HTMLImageElement) {
      body.src = value;
    }
  }
}

function setValue(time: string, selector: string, value: any): void {
  const body = document.querySelector(`[data-${time}-${selector}]`) as
    | HTMLImageElement
    | HTMLParagraphElement
    | Heading;
  body && (body.textContent = value);
}

function convertToTime(value: number): string {
  const time = new Date(value * 1000).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
  return time;
}

function getIconUrl(iconCode: number): string {
  return `icons/vuesax/linear/${iconMap.get(iconCode)}.svg`;
}
