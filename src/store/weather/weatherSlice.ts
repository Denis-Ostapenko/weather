import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Cities, IWeathers } from "../../type";

interface WeatherState {
  cities: Cities[] | null;
  citiesWeather: IWeathers[] | null;
  loading: boolean;
  error: string | null;
}

const initialState: WeatherState = {
  cities: localStorage["cities"] ? JSON.parse(localStorage["cities"]) : null,
  citiesWeather: null,
  loading: false,
  error: null,
};

export const weatherSlice = createSlice({
  name: "Weather",
  initialState,
  reducers: {
    citiesAdd(state, action: PayloadAction<Cities>) {
      state.cities = state.cities ? [...state.cities, action.payload] : [action.payload];
    },
    citiesWeather(state) {
      state.loading = true;
      state.error = null;
    },
    citiesWeatherSuccess(state, action: PayloadAction<IWeathers>) {
      state.loading = false;
      state.error = null;
      state.citiesWeather = state.citiesWeather ? [...state.citiesWeather, action.payload] : [action.payload];
    },
    citiesWeatherError(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    citiesDelete(state, action: PayloadAction<{ newCities: Cities[]; newCitiesWeather: IWeathers[] }>) {
      state.cities = action.payload.newCities;
      state.citiesWeather = action.payload.newCitiesWeather;
    },
  },
});

export default weatherSlice.reducer;
