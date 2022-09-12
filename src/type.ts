export interface IWeather {
  description: string;
  icon: string;
  temp: number;
  speed: number;
  dt: number;
}
export interface IWeathers {
  country: string;
  id: number;
  name: string;
  weatherList: IWeather[];
}
export type Cities = { lat: number; lon: number; id: number };
