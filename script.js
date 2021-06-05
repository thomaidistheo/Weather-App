window.addEventListener('load', () => {
    let lon
    let lat
    let units = 'metric'
    const apiKey = config.WEATHER_API

    let apiErrorMsg = document.querySelector('.location-error')

    let currentTime = document.querySelector('.current-time')
    let location = document.querySelector('.location')
    let weatherDesc = document.querySelector('.weather-desc')
    let weatherTemp = document.querySelector('.weather-temp')
    let weatherIcon = document.querySelector('.weather-icon')

    let cloudPercentage = document.querySelector('.cloud-percentage')
    let humidityPercentage = document.querySelector('.humidity-percentage')
    let visibilityMetres = document.querySelector('.visibility-metres')

    let visibility

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            lon = position.coords.longitude
            lat = position.coords.latitude
            console.log(`long: ${lon} lat: ${lat}`)

            const api = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=daily&units=${units}&appid=${apiKey}`

            function handleErrors(res) {
                if (!res.ok) {
                    throw Error(res.statusText)
                }
                return res
            }

            fetch(api, {
                mode: 'cors'
            })
                .then(handleErrors)
                .then(res => {
                    return res.json()
                })
                .then(data => {
                    console.log(data)

                    const currentWeather = {
                        date: data.current.dt,
                        timezone: data.timezone,
                        weatherDesc: data.current.weather[0].description,
                        weatherTemp: data.current.temp,
                        weatherIcon: `http://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png`,
                        cloudPercentage: data.current.clouds,
                        humidityPercentage: data.current.humidity,
                        visibility: data.current.visibility
                    }
                    populateUI(currentWeather)
                })

        })
    } else {
        apiErrorMsg.classList.remove('hidden')
    }

    let populateUI = (currentWeather) => {
        currentTime.textContent = currentWeather.date
        location.textContent = currentWeather.timezone
        weatherDesc.textContent = currentWeather.weatherDesc
        weatherTemp.textContent = currentWeather.weatherTemp
        weatherIcon.src = currentWeather.weatherIcon
        cloudPercentage.textContent = `${currentWeather.cloudPercentage}%`
        humidityPercentage.textContent = `${currentWeather.humidityPercentage}%`

        visibility = currentWeather.visibility

        if (visibility > 9999) {
            visibility = visibility / 1000
            visibilityMetres.textContent = `${visibility}km`
        } else if (visibility > 999 && visibility < 9999) {
            visibility = visibility / 100
            visibilityMetres.textContent = `${visibility}km`
        } else {
            visibilityMetres.textContent = `${visibility}m`
        }
    }
})

