import { useEffect, useState } from "react";
import "../App.css";
import type { CurrentWeather } from "../types/Weather";
import {
  Cloud,
  CloudRain,
  HazeIcon,
  Sun,
  Thermometer,
  Wind,
} from "lucide-react";
import { weatherClient } from "../api/WeatherClient";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { ForecastDay } from "../types/Forecast";
import type {
  WeatherDetailItem,
  WeatherDetailProps,
} from "../types/WeatherDetail";

function WeatherDetail({
  icon: Icon,
  label,
  value,
  delay = 0,
}: WeatherDetailProps) {
  return (
    <div
      className="weather-detail flex items-center justify-between rounded-xl border border-white/20 bg-white/10 p-4 transition-all duration-300 hover:-translate-y-1 hover:bg-white/20 hover:shadow-lg "
      style={{
        animationDelay: `${delay}ms`,
      }}
    >
      <div className="flex items-center gap-3">
        <Icon size={26} className="text-sky-300" />

        <span className="text-sm text-white/70">{label}</span>
      </div>

      <strong className="text-lg">{value}</strong>
    </div>
  );
}
function WeatherPage() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<CurrentWeather | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const cityFromUrl = searchParams.get("city");

  const fetchWeather = async (location: string) => {
    try {
      setLoading(true);
      setError(null);

      const [weatherResult, forecastResult] = await Promise.all([
        weatherClient.GetCurrentWeather(location),
        weatherClient.GetForecast(location),
      ]);
      setWeather(weatherResult);
      setForecast(forecastResult);
    } catch {
      setWeather(null);
      setForecast([]);
      setError("Coud not load weather");
    } finally {
      setLoading(false);
    }
  };
  const searchWeather = async () => {
    const trimmedCity = city.trim();
    if (!trimmedCity) {
      setError("!EROOR ERROR ERROR! ");
      return;
    }
    navigate(`?city=${encodeURIComponent(trimmedCity)}`);
  };

  useEffect(() => {
    if (!cityFromUrl) {
      return;
    }
    setCity(cityFromUrl);
    fetchWeather(cityFromUrl);
  }, [cityFromUrl]);

  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const location = `${latitude},${longitude}`;
        fetchWeather(location);
      },
      () => {
        setError("Could not get your location!");
      },
    );
  };

  const weatherDetails: WeatherDetailItem[] = weather
    ? [
        {
          icon: Thermometer,
          label: "Feels like",
          value: `${weather.FeelsLikeC}°C`,
        },
        {
          icon: HazeIcon,
          label: "Heat index",
          value: `${weather.HeatIndexC}°C`,
        },
        { icon: Wind, label: "Wind", value: `${weather.WindKPH} km/h` },
        { icon: Cloud, label: "Cloud", value: `${weather.Cloud}%` },
        { icon: Sun, label: "UV", value: `${weather.Uv}` },
        {
          icon: CloudRain,
          label: "Chance of rain",
          value: `${weather.ChanceOfRain}%`,
        },
      ]
    : [];

  const now = new Date();
  const firstForecastDay = forecast[0];
  const visibleHours =
    firstForecastDay?.Hours.filter((hours) => {
      const hourTime = new Date(hours.Time.replace(" ", "T"));
      const IsToday =
        hourTime.getFullYear() === now.getFullYear() &&
        hourTime.getMonth() === now.getMonth() &&
        hourTime.getDate() === now.getDate();
      if (!IsToday) {
        return true;
      }
      return hourTime >= now;
    }) ?? [];
  return (
    <div className="min-h-screen w-full bg-linear-to-br from-sky-400 via-blue-500 to-indigo-700 p-6">
      <div className="mx-auto max-w-4xl rounded-3xl border border-white/20 bg-white/15 p-8 text-white shadow-2xl backdrop-blur-xl">
        <h1 className="text-3xl font-bold">Weather</h1>

        <p className="mt-2 mb-6 text-white/60">
          Check current weather anywhere
        </p>

        {/* Search is ALWAYS visible */}
        <form
          className="flex flex-col gap-3 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            searchWeather();
          }}
        >
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city..."
            className=" flex-1 rounded-xl  border  border-white/20 bg-white/10  p-3 text-white outline-none transition-all duration-300 placeholder:text-white/40 focus:border-white/60  focus:bg-white/20 focus:shadow-lg"
          />

          <button
            type="submit"
            disabled={city.trim() === "" || loading}
            className="rounded-xl bg-white px-6 py-3 font-semibold text-blue-700 transition-all  duration-200 hover:scale-105  hover:bg-blue-50 active:scale-95 disabled:opacity-50 "
          >
            Search
          </button>
        </form>

        <button
          onClick={getCurrentLocation}
          disabled={loading}
          className="mt-3 rounded-xl bg-white/10 px-5 py-2.5 transition hover:bg-white/20 disabled:opacity-50"
        >
          📍 Use my location
        </button>

        {error && (
          <p className="mt-4 rounded-xl border border-red-300/30 bg-red-500/20 p-3 text-red-100">
            {error}
          </p>
        )}

        {/* Only this section changes */}
        {loading ? (
          <div className="mt-10 animate-pulse text-center text-white/60">
            Loading weather...
          </div>
        ) : weather ? (
          <div
            key={`${weather.Name}-${weather.Country}`}
            className="weather-enter mt-8"
          >
            <div className="mb-6 text-center">
              <h2 className="text-3xl font-bold">
                {weather.Name}, {weather.Country}
              </h2>

              <div className="mt-4 flex items-center justify-center gap-4">
                <img
                  src={`https:${weather.Condition.icon}`}
                  alt={weather.Condition.text}
                  className="h-20 w-20"
                />

                <strong className="text-6xl text-amber-300">
                  {weather.TemperatureC}°C
                </strong>
              </div>

              <p className="mt-2 text-lg text-gray-300">
                {weather.Condition.text}
              </p>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-4">
              {visibleHours.map((hour) => (
                <div
                  key={hour.Time}
                  className="min-w-32 rounded-xl border border-white/20 bg-white/10 p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:bg-white/20"
                >
                  <p className="text-sm text-white/60">
                    {new Date(hour.Time.replace(" ", "T")).toLocaleTimeString(
                      "en-US",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )}
                  </p>

                  <img
                    src={`https:${hour.Condition.icon}`}
                    alt={hour.Condition.text}
                    className="mx-auto h-12 w-12"
                  />

                  <strong className="block text-xl">{hour.TempC}°C</strong>

                  <p className="mt-1 text-xs text-white/60">
                    {hour.Condition.text}
                  </p>

                  <p className="mt-2 text-sm text-sky-200">
                    💧 {hour.ChanceOfRain}%
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              {weatherDetails.map((detail, index) => (
                <div
                  key={detail.label}
                  className="detail-enter"
                  style={{ animationDelay: `${index * 400}ms` }}
                >
                  <WeatherDetail
                    key={detail.label}
                    icon={detail.icon}
                    label={detail.label}
                    value={detail.value}
                    delay={index * 400}
                  />
                </div>
              ))}

              <div className="mt-8">
                <h3 className="mb-4 text-xl font-semibold">Forecast</h3>

                <div className="flex flex-col gap-3">
                  {forecast.map((day) => (
                    <div
                      key={day.Date}
                      onClick={() =>
                        navigate(
                          `/weather/${encodeURIComponent(weather.Name)}/${day.Date}`,
                        )
                      }
                      className="cursor-pointer rounded-2xl border border-white/20 bg-white/10 p-4 transition-all duration-300 hover:-translate-y-1 hover:bg-white/20 hover:shadow-lg"
                    >
                      <h2 className="text-2xl font-semibold">
                        {new Date(day.Date).toLocaleDateString("en-US", {
                          weekday: "long",
                        })}
                      </h2>

                      <p>{day.Date}</p>
                      <p>
                        {day.MaxTempC}° / {day.MinTempC}°
                      </p>

                      <p>{day.ChanceOfRain}% rain</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
            <Cloud size={48} className="mb-4 text-white/60" />
            <p className="mt-2 text-sm text-white/60">
              Search for a city or use your current location to see the weather.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default WeatherPage;
