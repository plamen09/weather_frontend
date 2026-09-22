import type { WeatherCondition } from "./Weather";

export type ForecastDay = {
  Date: string;
  MaxTempC: number;
  MinTempC: number;
  WindKPH: number;
  Cloud: number;
  ChanceOfRain: number;
  Condition: WeatherCondition;
  Hours: Hours[];
};
export type Hours = {
  Time: string;
  TempC: number;
  FeelsLikeC: number;
  ChanceOfRain: number;
  Condition: WeatherCondition;
};
