import { useState } from "react";

import "../App.css";

import type { CurrentWeather, WeatherDetailProps } from "../types/Weather";

import { weatherClieant } from "../api/WeatherClient";

import {
  Cloud,
  CloudRain,
  HazeIcon,
  Sun,
  Thermometer,
  Wind,
} from "lucide-react";

function WeatherDetail({ icon: Icon, label, value }: WeatherDetailProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/20 bg-white/10 p-4 transition-all duration-300 hover:-translate-1 hover-white/20 hover:shadow-lg ">
      <div className="flex items-center gap-3">
        <Icon size={26} className="h-20 w-20 weather-icon-float" />

        <span className="text-sm text-white/70">{label}</span>
      </div>

      <strong className="text-lg">{value}</strong>
    </div>
  );
}

function WeatherPage() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<CurrentWeather | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const searchWeather = async () => {
    const trimmedCity = city.trim();

    if (!trimmedCity) {
      setError("Please enter a city name");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await weatherClieant.GetCurrentWeather(trimmedCity);

      setWeather(result);
    } catch {
      setWeather(null);
      setError("Could not find weather for this city");
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        const location = `${latitude},${longitude}`;

        try {
          setLoading(true);
          setError(null);

          const result = await weatherClieant.GetCurrentWeather(location);

          setWeather(result);
        } catch {
          setWeather(null);
          setError("Failed to get weather");
        } finally {
          setLoading(false);
        }
      },

      () => {
        setError("Could not get your location");
      },
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-sky-400 via-blue-500 to-indigo-700 p-6">
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

            <div className="flex flex-col gap-3">
              {[
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
                {
                  icon: Wind,
                  label: "Wind",
                  value: `${weather.WindKPH} km/h`,
                },
                {
                  icon: Cloud,
                  label: "Cloud",
                  value: `${weather.Cloud}%`,
                },
                {
                  icon: Sun,
                  label: "UV",
                  value: weather.Uv,
                },
                {
                  icon: CloudRain,
                  label: "Chance of rain",
                  value: `${weather.ChanceOfRain}%`,
                },
              ].map((detail, index) => (
                <div
                  key={detail.label}
                  className="detail-enter"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <WeatherDetail
                    key={detail.label}
                    icon={detail.icon}
                    label={detail.label}
                    value={detail.value}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
            <Cloud size={48} className="mb-4 text-white/60" />

            <h2 className="text-xl font-semibold">No weather data yet</h2>

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
