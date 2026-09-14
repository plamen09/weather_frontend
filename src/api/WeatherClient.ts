import type { CurrentWeather } from "../types/Weather";
import { apiClient } from "./ApiClient";

export class WeatherClient {
  async GetCurrentWeather(city: string): Promise<CurrentWeather> {
    const response = await apiClient.get<CurrentWeather>("/weather", {
      params: { city },
    });
    return response.data;
  }
}
export const weatherClieant = new WeatherClient();
