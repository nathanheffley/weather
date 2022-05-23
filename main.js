import './style.css'

const app = document.querySelector('#app')

 navigator.geolocation.getCurrentPosition(
  position => {
    const coords = `${position.coords.latitude},${position.coords.longitude}`
    fetch(`https://api.weather.gov/points/${coords}`)
      .then(res => res.json())
      .then(data => {
        fetch(data.properties.forecastHourly)
          .then(res => res.json())
          .then(data => {
            const periods = data.properties.periods
            periods.forEach(period => {
              app.innerHTML += `
              <img src="${period.icon}" alt="" />
              <p>
                ${period.startTime} - ${period.shortForecast} - ${period.temperature}${period.temperatureUnit}
              </p>`
            })
          })
      })
  },
)
