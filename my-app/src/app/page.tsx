"use client"

import "./page.modules.css";
import { useEffect, useState } from "react";

function getCurrentDate() {
  const currentDate = new Date();
  const options = { 
    month: "short", // shortened month name (e.g. Sep)
    day: "numeric", // day of the month (e.g. 13)
    year: "numeric" // full year (e.g. 2024)
  };
  const timeOptions = { 
    hour: "2-digit", // hour in 12-hour format
    minute: "2-digit", // minute
    hour12: true // adds AM/PM
  };

  const dateString = currentDate.toLocaleString("en-US", options);
  const timeString = currentDate.toLocaleString("en-US", timeOptions);

  return `${dateString}, ${timeString}`;
}
export default function Home() {
  const date = getCurrentDate();
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState("");

  async function fetchData(cityName: string) {
    try {
      const response = await fetch(
        `http://localhost:3000/api/weather?address=${cityName}`
      );
      const jsonData = await response.json();
      setWeatherData(jsonData.data);

      
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  async function fetchDataByCoordinates(latitude:string, longitude:string) {
    try {
      const response = await fetch(
        `http://localhost:3000/api/weather?lat=${latitude}&lon=${longitude}`
      );
      const jsonData = (await response.json()).data;
      setWeatherData(jsonData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchDataByCoordinates(latitude, longitude);
        },
        (error) => {
          console.error("Error getting geolocation:", error);
        }
      );
    }
  }, []);
  
  return (
    <>
      <h2 className="text-center bg-gray-200 font-semibold text-black text-2xl ">Weather App</h2>
    <main className="flex justify-center p-4 bg-gray-200 h-[28rem]">
      
      <article className="bg-white rounded-lg shadow-lg p-4 w-96">
        <form
          className="flex flex-col space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            fetchData(city);
          }}
        >
          <input
            className="input_field p-2 rounded-lg border-2 border-gray-200 focus:outline-none font-medium focus:border-blue-500"
            placeholder="Enter city name"
            type="text"
            id="cityName"
            name="cityName"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button
            className="search_button bg-zinc-500 hover:bg-zinc-700 text-white font-bold py-2 px-4 rounded"
            type="submit"
          >
            Search
          </button>
        </form>
        {weatherData && weatherData.weather && weatherData.weather[0] ? (
          <>
            <div className="icon_and_weatherInfo flex space-x-4 mt-4">
              <div className="weatherIcon text-3xl">
                {weatherData?.weather[0]?.description === "rain" ||
                weatherData?.weather[0]?.description === "fog" ? (
                  <i
                    className={`wi wi-day-${weatherData?.weather[0]?.description}`}
                  ></i>
                ) : (
                  <i className="wi wi-day-cloudy"></i>
                )}
              </div>
              <div className="weatherInfo">
                <div className="temperature text-2xl font-bold">
                  <span>
                    {(weatherData?.main?.temp - 273.15).toFixed(2) +
                      String.fromCharCode(176)}
                    C
                  </span>
                </div>
                <div className="weatherCondition text-lg">
                  {weatherData?.weather[0]?.description?.toUpperCase()}
                </div>
              </div>
            </div>
            <div className="place text-lg font-bold mt-2">
              {weatherData?.name}
            </div>
            <div className="date text-lg mt-2 font-medium text-zinc-500">{date}</div>
            
            <div className="weatherDetails mt-4">
              <div className="humidity flex justify-between">
                <span className="font-medium">Humidity:</span>
                <span>{weatherData?.main?.humidity}%</span>
              </div>
              <div className="wind flex justify-between">
                <span className="font-medium">Wind:</span>
                <span>{weatherData?.wind?.speed} m/s</span>
              </div>
            </div>
          </>
        ) : (
          <div className="place text-lg font-bold mt-2">Loading...</div>
        )}
      </article>
    </main>
    </>
  );
}