import type { LucideIcon } from "lucide-react";

export interface WeatherCondition {
  text: string;
  icon: string;
  code: number;
}

export interface CurrentWeather {
  Name: string;
  Country: string;
  Region: string;
  TemperatureC: number;
  FeelsLikeC: number;
  HeatIndexC: number;
  WindKPH: number;
  Cloud: number;
  Uv: number;
  ChanceOfRain: number;
  IsDay: number;

  Condition: WeatherCondition;
}

export type WeatherDetailProps = {
  icon: LucideIcon;
  label: string;
  value: string | number;
  delay?: number;
};


