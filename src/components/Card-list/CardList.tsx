import React, { useState, useEffect } from "react";
import { useAppDispatch, useTypedSelector } from "../../hooks/redux";
import { usePosition } from "../../hooks/usePosition";
import { citiesAdd, fetchWeather } from "../../store/weather/weatherAction";
import CardItem from "../Card-item/CardItem";
import "./Card-list.css";

interface ICountry {
  country: string;
  name: string;
  lat: number;
  lon: number;
}
type PositionType = string | { lat: number; lon: number } | null;

function CardList() {
  const [searchValue, setSearchValue] = useState<string>("");
  const [countryArr, setCountryArr] = useState<ICountry[] | null>(null);
  const [position, setPosition] = useState<PositionType>(null);
  const getPosition = usePosition();
  const { cities, citiesWeather } = useTypedSelector((state) => state.weatherReducer);
  const dispatch = useAppDispatch();

  // получение данных погоды по геоданным пользователя
  useEffect(() => {
    if (getPosition && getPosition !== position) {
      setPosition(getPosition);
      if (!cities && typeof getPosition !== "string") {
        dispatch(fetchWeather(getPosition.lat, getPosition.lon));
        dispatch(citiesAdd(getPosition.lat, getPosition.lon));
      }
      // если доступ к геоданным нет, то брянская область по умолчанию
      if (!cities && typeof getPosition === "string") {
        dispatch(fetchWeather(53.2423778, 34.3668288));
        dispatch(citiesAdd(53.2423778, 34.3668288));
      }
    }
  }, [getPosition]);

  // при изменении поискового запроса, запускаятся таймер с дальнейшим вызовом функции по поиску вариантов городов
  useEffect(() => {
    if (searchValue === "") {
      setCountryArr(null);
    }
    if (searchValue !== "") {
      const handler = setTimeout(() => {
        fetchCities();
      }, 500);
      return () => {
        clearTimeout(handler);
      };
    }
  }, [searchValue]);

  // варианты городов по запросу
  const fetchCities = async () => {
    const responseCities = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${searchValue}&limit=5&appid=${process.env.REACT_APP_WEATHER_API_KEY}`
    );
    if (responseCities.ok) {
      let citiesArr = await responseCities.json();
      // сохранение вариантов городов с координатами
      setCountryArr(
        citiesArr.map((elCountry: { name: string; country: string; lat: number; lon: number }) => {
          const { country, name, lat, lon } = elCountry;
          return { country, name, lat, lon };
        })
      );
    }
  };

  // при нажатии отправляется запрос с координатами в action
  const optionClick = (country: ICountry) => {
    let repeatCiti = false;
    // проверка на повторение городов с уже отображёнными
    cities?.forEach((el) => {
      if (el.lat === country.lat && el.lon === country.lon) {
        repeatCiti = true;
      }
    });
    if (!repeatCiti) {
      dispatch(fetchWeather(country.lat, country.lon));
      dispatch(citiesAdd(country.lat, country.lon));
    }
    setCountryArr(null);
    setSearchValue("");
  };

  const changeSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchValue(event.target.value);
  };
  return (
    <>
      <div className="search-container">
        <input
          className="search"
          type="search"
          placeholder="Specify the city"
          value={searchValue}
          onChange={changeSearch}
        />
        {countryArr && (
          <>
            {countryArr.length === 0 && <div className="search__option-found">Nothing was found</div>}
            <select className="search__option-container" size={countryArr?.length} name="cities" multiple>
              {countryArr?.map((country) => {
                return (
                  <option key={country.lat} className="search__option" onClick={() => optionClick(country)}>
                    {country.name}, {country.country}
                  </option>
                );
              })}
            </select>
          </>
        )}
      </div>
      <ul className="card-list">
        {citiesWeather?.map((citiWeather) => {
          return <CardItem key={citiWeather.id} citiWeather={citiWeather} />;
        })}
      </ul>
    </>
  );
}

export default CardList;
