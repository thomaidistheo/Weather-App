window.addEventListener('load', ()=> {
    let lon
    let lat
    let units = 'metric'
    const apiKey = 'cb518dc9eec343db4f3ddc77917b8524'

    let date = new Date()

    let currentTime = document.querySelector('.current-time')
    let location = document.querySelector('.location')
    let weatherDesc = document.querySelector('.weather-desc')
    let weatherTemp = document.querySelector('.weather-temp')
    let weatherIcon = document.querySelector('.weather-icon')

    let cloudPercentage = document.querySelector('.cloud-percentage')
    let humidityPercentage = document.querySelector('.humidity-percentage')
    let visibilityMetres = document.querySelector('.visibility-metres')

    let visibility

    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
           lon = position.coords.longitude
           lat = position.coords.latitude
           console.log(`long: ${lon} lat: ${lat}`)
           
           const api = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=daily&units=${units}&appid=${apiKey}`
           fetch(api, {
               mode: 'cors'
           })
               .then(res => {
                   return res.json()
               })
               .then(data => {
                    console.log(data)

                    currentTime.textContent = date /* data.current.dt */
                    location.textContent = data.timezone
                    weatherDesc.textContent = data.current.weather[0].description
                    weatherTemp.textContent = data.current.temp
                    weatherIcon.src = `http://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png`
                    cloudPercentage.textContent = `${data.current.clouds}%`
                    humidityPercentage.textContent = `${data.current.humidity}%`

                    visibility = data.current.visibility
                    
                    if (visibility > 9999) {
                        visibility = visibility / 1000
                        visibilityMetres.textContent = `${visibility}km`
                    } else if (visibility > 999 && visibility < 9999) {
                        visibility = visibility / 100
                        visibilityMetres.textContent = `${visibility}km`
                    } else {
                        visibilityMetres.textContent = `${visibility}m`
                    }
               })
        })
    } else {
        // TODO throw error
    }
})

