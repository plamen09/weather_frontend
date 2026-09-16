import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { weatherClient } from "../api/WeatherClient";
import type { ForcastDetailProps, ForecastDay } from "../types/Weather";

function ForcastDetail({ label, value, delay = 0 }: ForcastDetailProps) {
  return (
    <div
      className="forcast-detail flex items-center justify-between rounded-xl border border-white/20 bg-white/10 p-4 transition-all duration-300 hover:-translate-y-1 hover:bg-white/20 hover:shadow-lg"
      style={{
        animationDelay: `${delay}m`,
      }}
    >
      <span className="text-lg">
        {label}
      </span>
      <strong className="text-lg">{value}</strong>
    </div>
  );
}

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
          {[
            {
              label: "Maximum temerature",
              value: `${day.MaxTempC}C`,
            },
            {
              label: "Minimum temperature",
              value: `${day.MinTempC}C`,
            },
            {
              label: "Wind",
              value: `${day.WindKPH}km/h`,
            },
            {
              label: "Cloud",
              value: `${day.Cloud}%`,
            },
            {
              label: "Chanse of rain",
              value: `${day.ChanceOfRain}%`,
            },
          ].map((detail, index) => (
            <div
              key={detail.label}
              className="detail-forcast"
              style={{ animationDelay: `${index * 300}ms` }}
            >
              <ForcastDetail
                key={detail.label}
                label={detail.label}
                value={detail.value}
                delay={index * 300}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default ForecastDayPage;
