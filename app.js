/******************************************************************************
***
* WEB422 – Assignment 1
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: Harmanjeet Singh Hara Student ID: 118624220 Date: 27th may 2024
*
*
******************************************************************************
**/

document.addEventListener('DOMContentLoaded', () => {
    const apiKey = '35e3efab0fe4a7d5850b58d5440e6842'; 
    const locationWeather = document.getElementById('location-weather');
    const searchButton = document.getElementById('search-button');
    const cityInput = document.getElementById('city-input');
    const errorMessage = document.getElementById('error-message');
    const weatherResults = document.getElementById('weather-results');

    //User Location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            fetchWeatherByCoords(latitude, longitude);
        }, showError);
    } else {
        locationWeather.textContent = 'Geolocation is not supported by this browser.';
    }

    // Coordinates Fetching
    function fetchWeatherByCoords(lat, lon) {
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
            .then(response => response.json())
            .then(data => displayWeather(data, locationWeather))
            .catch(showError);
    }

    // City Fetching
    function fetchWeatherByCity(query) {
        fetch(`https://api.openweathermap.org/data/2.5/find?q=${query}&appid=${apiKey}&units=metric`)
            .then(response => response.json())
            .then(data => {
                if (!data.list || data.list.length === 0) {
                    errorMessage.textContent = 'City not found.';
                } else {
                    errorMessage.textContent = '';
                    displayWeather(data.list[0], weatherResults);
                }
            })
            .catch(showError);
    }

    // Data Showcase
    function displayWeather(data, element) {
        const { name, sys, weather, main, wind } = data;
        element.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">
                        <img src="http://openweathermap.org/images/flags/${sys.country.toLowerCase()}.png" alt="${sys.country} flag" class="flag-icon">
                        ${name}, ${sys.country}
                    </h5>
                    <p class="card-text">${weather[0].description}</p>
                    <p class="card-text">Current Temperature: ${main.temp}°C</p>
                    <p class="card-text">Min: ${main.temp_min}°C, Max: ${main.temp_max}°C</p>
                    <p class="card-text">Wind Speed: ${wind.speed} m/s | Humidity: ${main.humidity}% | Pressure: ${main.pressure} hPa</p>
                </div>
            </div>
        `;
    }

    // Adding Search Button
    searchButton.addEventListener('click', () => {
        const query = cityInput.value.trim();
        if (query) {
            errorMessage.textContent = '';
            fetchWeatherByCity(query);
        } else {
            errorMessage.textContent = 'Please enter a city name.';
        }
    });

    // Using Enter key for input
    cityInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            searchButton.click();
        }
    });

    // Error Message
    function showError(error) {
        errorMessage.textContent = `Error: ${error.message}`;
    }
});
