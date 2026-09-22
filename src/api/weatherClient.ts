import type { ForecastDay } from "../types/Forecast";
import type { CurrentWeather } from "../types/Weather";
import { apiClient } from "./ApiClient";

export class WeatherClient {
  async GetCurrentWeather(city: string): Promise<CurrentWeather> {
    const response = await apiClient.get<CurrentWeather>("/weather/current", {
      params: { city },
    });
    return response.data;
  }

  async GetForecast(city: string): Promise<ForecastDay[]> {
    const response = await apiClient.get<ForecastDay[]>("/weather/forecast", {
      params: { city },
    });
    return response.data;
  }
}
export const weatherClient = new WeatherClient();
