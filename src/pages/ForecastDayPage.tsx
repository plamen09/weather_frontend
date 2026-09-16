import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { weatherClient } from "../api/WeatherClient";
import type { ForecastDay } from "../types/Weather";

function ForecastDayPage() {
  const { city, date } = useParams();
  const navigate = useNavigate();
  const [day, setDay] = useState<ForecastDay | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const loadForecast = async () => {
      if (!city || !date) {
        return;
      }

      try {
        setLoading(true);
        const forecast = await weatherClient.GetForecast(city);

        const selectedDay = forecast.find((item) => item.Date === date);
        setDay(selectedDay ?? null);
      } finally {
        setLoading(false);
      }
    };
    loadForecast();
  }, [city, date]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-700 p-6 text-white">
        Loading...
      </div>
    );
  }
  if (!day) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-700 p-6 text-white">
        Forecast not found.
      </div>
    );
  }
  const dayName = new Date(day.Date).toLocaleDateString("en-US", {
    weekday: "long",
  });
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-700 p-6">
      <div className="mx-auto max-w-3xl rounded-3xl border border-white/20 bg-white/15 p-8 text-white shadow-2xl backdrop-blur-xl">
        <button
          onClick={() => navigate(`/?city=${encodeURIComponent(city!)}`)}
          className="mb-6 rounded-xl bg-white/10 px-4 py-2 hover:bg-white/20"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-bold">{city}</h1>
        <h2 className="text-2xl font-semibold">{dayName}</h2>

        <p className="mt-2 text-white/60">{day.Date}</p>

        <img
          src={`https:${day.Condition.icon}`}
          alt={day.Condition.text}
          className="mx-auto h-24 w-24"
        />

        <p className="text-center text-xl">{day.Condition.text}</p>

        <div className="mt-8 space-y-3">
          <div className="flex justify-between rounded-xl bg-white/10 p-4">
            <span>Maximum temperature</span>
            <strong>{day.MaxTempC}°C</strong>
          </div>

          <div className="flex justify-between rounded-xl bg-white/10 p-4">
            <span>Minimum temperature</span>
            <strong>{day.MinTempC}°C</strong>
          </div>
          <div className="flex justify-between rounded-xl bg-white/10 p-4">
            <span>Wind</span>
            <strong>{day.WindKPH}km/h</strong>
          </div>
          <div className="flex justify-between rounded-xl bg-white/10 p-4">
            <span>Cloud</span>
            <strong> {day.Cloud}%</strong>
          </div>

          <div className="flex justify-between rounded-xl bg-white/10 p-4">
            <span>Chance of rain</span>
            <strong>{day.ChanceOfRain}%</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ForecastDayPage;
