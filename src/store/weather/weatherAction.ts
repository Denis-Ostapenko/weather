import { weatherSlice } from "./weatherSlice";
import { AppDispatch } from "../store";
import { Cities, IWeathers } from "../../type";

// поиск по координата погоду города и добавление в store
export const fetchWeather = (lat: number, lon: number) => async (dispatch: AppDispatch) => {
  try {
    dispatch(weatherSlice.actions.citiesWeather());
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.REACT_APP_WEATHER_API_KEY}&units=metric`
    ).then((res) => {
      return res.json();
    });
    const {
      city: { country, id, name },
      list,
    } = response;
    const weatherList: [] = list.map((element: any) => {
      const {
        dt,
        main: { temp },
        weather: [{ icon, description }],
        wind: { speed },
      } = element;
      return { dt, temp, icon, description, speed };
    });
    const newWeatherCiti: IWeathers = {
      country,
      id,
      name,
      weatherList,
    };
    dispatch(weatherSlice.actions.citiesWeatherSuccess(newWeatherCiti));
  } catch (error) {
    let message;
    if (error instanceof Error) message = error.message;
    else message = String(error);
    dispatch(weatherSlice.actions.citiesWeatherError(message));
  }
};

// Сохраниение координат в localStorage
export const citiesAdd = (lat: number, lon: number) => async (dispatch: AppDispatch) => {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.REACT_APP_WEATHER_API_KEY}&units=metric`
  ).then((res) => {
    return res.json();
  });
  const {
    city: { id },
  } = response;
  localStorage.setItem(
    "cities",
    localStorage.getItem("cities")
      ? JSON.stringify([...JSON.parse(localStorage["cities"]), { lat, lon, id }])
      : JSON.stringify([{ lat, lon, id }])
  );
  dispatch(weatherSlice.actions.citiesAdd({ lat, lon, id }));
};
// удаление погоды города
export const citiesDelete = (newCities: Cities[], newCitiesWeather: IWeathers[]) => (dispatch: AppDispatch) => {
  localStorage.setItem("cities", JSON.stringify(newCities));
  dispatch(weatherSlice.actions.citiesDelete({ newCities, newCitiesWeather }));
};
