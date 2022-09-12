import { useState, useEffect } from "react";

export const usePosition = () => {
  const [position, setPosition] = useState<null | { lat: number; lon: number }>(null);
  const [error, setError] = useState<null | string>(null);
  const geo = navigator.geolocation;
  useEffect(() => {
    geo.getCurrentPosition(success, onError);
  }, []);
  const onChange = (lat: number, lon: number) => {
    setPosition({ lat, lon });
  };

  const onError = (error: GeolocationPositionError) => {
    setError(error.message);
  };

  if (!geo) {
    setError("Геолокация не поддерживается браузером");
    return "Геолокация не поддерживается браузером";
  }
  function success(pos: GeolocationPosition) {
    const crd = pos.coords;
    onChange(crd.latitude, crd.longitude);
  }
  if (error) {
    return error;
  }
  if (position) {
    return position;
  }
};
