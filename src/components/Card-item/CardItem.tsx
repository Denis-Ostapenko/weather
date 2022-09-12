import React from "react";
import { intlFormat } from "date-fns";
import { useAppDispatch, useTypedSelector } from "../../hooks/redux";
import { citiesDelete } from "../../store/weather/weatherAction";
import { IWeathers } from "../../type";
import "./Card-item.css";

interface ICardItemProps {
  citiWeather: IWeathers;
}

function CardItem({ citiWeather }: ICardItemProps) {
  const { name, country, weatherList, id } = citiWeather;
  const { description, dt, icon, temp } = weatherList[0];
  const { cities, citiesWeather } = useTypedSelector((state) => state.weatherReducer);
  const dispatch = useAppDispatch();
  // преобразование даты в формат: день недели и время
  const date = intlFormat(
    new Date(dt * 1000),
    {
      weekday: "long",
      hour: "numeric",
      minute: "numeric",
      hour12: false,
    },
    {
      locale: `en-${country}`,
    }
  );
  let backgroundImage = icon;
  if (icon === "03d" || icon === "04d") {
    backgroundImage = "02d";
  }
  if (icon === "03n" || icon === "04n") {
    backgroundImage = "02n";
  }
  if (icon === "10d") {
    backgroundImage = "09d";
  }
  if (icon === "10n") {
    backgroundImage = "09n";
  }
  let colorText = "#000000";
  if (
    backgroundImage === "01n" ||
    backgroundImage === "02n" ||
    backgroundImage === "09n" ||
    backgroundImage === "11n" ||
    backgroundImage === "13n" ||
    backgroundImage === "50n" ||
    backgroundImage === "09d"
  ) {
    colorText = "#ffffff";
  }
  // удаление погоды города
  const clickDelete = (id: number) => {
    if (cities && citiesWeather) {
      const newCities = cities.filter((citi) => citi.id !== id);
      const newCitiesWeather = citiesWeather.filter((citi) => citi.id !== id);
      dispatch(citiesDelete(newCities, newCitiesWeather));
    }
  };

  return (
    <article
      className="card-item"
      style={{ backgroundImage: "url(" + require(`./weather-image/${backgroundImage}.jpg`) + ")", color: colorText }}
    >
      <div
        className={`card-item__delete ${colorText === "#ffffff" && "card-item__delete--white"}`}
        onClick={() => clickDelete(id)}
      ></div>
      <h2 className="card-item__title">{name}</h2>
      <span className="card-item__date">{date}</span>
      <img className="card-item__icon" src={`http://openweathermap.org/img/wn/${icon}@4x.png`} alt="" />
      <div className="card-item__description-container">
        <span className="card-item__temp">{Math.round(temp)}&#xb0;</span>
        <span className="card-item__description">{description}</span>
      </div>
      <ul className="card-item__list">
        {weatherList.map((element, index) => {
          if (0 < index && index < 6) {
            const elementDate = intlFormat(new Date(element.dt * 1000), {
              hour: "numeric",
              minute: "numeric",
              hour12: false,
            });
            return (
              <div key={id + element.dt} className="card-item__additional">
                <div className="additional__date">{elementDate}</div>
                <img
                  className="additional__icon"
                  src={`http://openweathermap.org/img/wn/${element.icon}@2x.png`}
                  alt=""
                />
                <span className="additional__temp">{Math.round(element.temp)}&#xb0;</span>
              </div>
            );
          }
          return null;
        })}
      </ul>
    </article>
  );
}

export default CardItem;
