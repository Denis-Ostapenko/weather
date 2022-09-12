import React, { useEffect } from "react";
import CardList from "./components/Card-list/CardList";
import "./App.css";
import { useAppDispatch, useTypedSelector } from "./hooks/redux";
import { fetchWeather } from "./store/weather/weatherAction";

function App() {
  const { cities } = useTypedSelector((state) => state.weatherReducer);
  const dispatch = useAppDispatch();
  // отображение погоды сохранённых в прошлой сессии городов
  useEffect(() => {
    cities?.forEach((citi) => {
      dispatch(fetchWeather(citi.lat, citi.lon));
    });
  }, []);
  return (
    <div className="app">
      <CardList />
    </div>
  );
}

export default App;
