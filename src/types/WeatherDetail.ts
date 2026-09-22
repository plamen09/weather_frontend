import type { LucideIcon } from "lucide-react";

export type ForecastDetailProps = {
  label: string;
  value: string | number;
  delay?: number;
};

export type WeatherDetailProps = {
  icon: LucideIcon;
  label: string;
  value: string | number;
  delay?: number;
};

export type WeatherDetailItem = {
  icon: LucideIcon;
  label: string;
  value: string | number;
};
