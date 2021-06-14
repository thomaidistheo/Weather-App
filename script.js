window.addEventListener('load', () => {
    let lon
    let lat
    let units = 'metric'
    const apiKey = config.WEATHER_API

    let apiErrorMsg = document.querySelector('.location-error')
    let reloadBtn = document.querySelector('#reloadBtn')
    
    let flexContainer = document.querySelector('.flex-container')
    let location = document.querySelector('.location')
    let currentTemp = document.querySelector('.current-temp')
    let currentIcon = document.querySelector('.current-icon')
    let currentHi = document.querySelector('.current-high')
    let currentLo = document.querySelector('.current-low')
    let currentDesc = document.querySelector('.current-desc')
    let currentWind = document.querySelector('.current-wind')
    let currentClouds = document.querySelector('.current-clouds')
    let currentHumidity = document.querySelector('.current-humidity')
    let currentVisibility = document.querySelector('.current-visibility')
    let dailyList = document.querySelector('#dailyList')

    let visibility

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            lon = position.coords.longitude
            lat = position.coords.latitude
            console.log(`long: ${lon} lat: ${lat}`)

            const api = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`

            async function fetchWeather() {
                const res = await fetch(api)
                const data = await res.json()
                return data
            }

            fetchWeather() 
                .then(data => {
                    console.log(data)
            
                    const currentWeather = {
                        timezone: data.timezone,
                        currentDesc: data.current.weather[0].description,
                        currentTemp: data.current.temp,
                        currentIcon: `http://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png`,
                        currentWind: data.current.wind_speed,
                        currentClouds: data.current.clouds,
                        currentHumidity: data.current.humidity,
                        visibility: data.current.visibility,
                        currentHi: data.daily[0].temp.max,
                        currentLo: data.daily[0].temp.min,
                    }
            
                    dailyForecast = data.daily

                    dailyForecast.forEach(upcomingDay => {
                        temp = upcomingDay.temp.day
                        day = upcomingDay.dt
            
                        let newDay = new Date(day*1000);
                        let days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
                        let dayOfWeek = days[newDay.getDay()]
                        
                        newLi = document.createElement('li')
                        dailyList.appendChild(newLi)
            
                        createDay = document.createElement('p')
                        newLi.appendChild(createDay)
                        createDay.textContent = dayOfWeek
            
                        newDiv = document.createElement('div')
                        newLi.appendChild(newDiv)
            
                        createTemp = document.createElement('p')
                        createTemp.textContent = `${Math.round(temp)}°`
                        newDiv.appendChild(createTemp)
            
                        createIcon = document.createElement('img')
                        createIcon.src = `http://openweathermap.org/img/wn/${upcomingDay.weather[0].icon}.png`
                        newDiv.appendChild(createIcon)
                    })
            
                    populateUI(currentWeather)
                })
        }, 
        error => {
            if (error.code == error.PERMISSION_DENIED) {
                apiErrorMsg.classList.remove('hidden')
                flexContainer.classList.add('hidden')

                reloadBtn.onclick = () => {
                    window.location.reload()
                }
                console.log('GEO LOCATION WAS DENIED.\n\nPLEASE RELOAD THE BROWSER AND ALLOW FOR GEO LOCATION SERVICES TO BE USED')
            }
        })
    } 

    let populateUI = (currentWeather) => {
        location.textContent = currentWeather.timezone
        currentDesc.textContent = currentWeather.currentDesc
        currentTemp.textContent = `${Math.round(currentWeather.currentTemp)}°`
        currentHi.textContent = `H:${Math.round(currentWeather.currentHi)}°`
        currentLo.textContent = `L:${Math.round(currentWeather.currentLo)}°`
        currentIcon.src = currentWeather.currentIcon
        currentWind.textContent = `${Math.floor(currentWeather.currentWind)}bft`
        currentClouds.textContent = `${currentWeather.currentClouds}%`
        currentHumidity.textContent = `${currentWeather.currentHumidity}%`

        visibility = currentWeather.visibility

        if (visibility > 9999) {
            visibility = visibility / 1000
            currentVisibility.textContent = `${visibility}km`
        } else if (visibility > 999 && visibility < 9999) {
            visibility = visibility / 100
            currentVisibility.textContent = `${visibility}km`
        } else {
            currentVisibility.textContent = `${visibility}m`
        }
    }
})

