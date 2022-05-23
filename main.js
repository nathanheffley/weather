import './style.css'

const alerts = document.querySelector('#alerts')
const app = document.querySelector('#app')

const getAlerts = coords => {
  fetch(`https://api.weather.gov/alerts/active?point=${coords.latitude},${coords.longitude}`)
    .then(res => res.json())
    .then(data => {
      data.features.forEach(alert => {
        alerts.innerHTML += `<h2>${alert.properties.event}</h2>`
        alerts.innerHTML += `<p>${alert.properties.description}</p>`
      })
    })
}

const generateToday = (day, periods) => {
  const date = (new Date(day)).toLocaleDateString('en-US', {month: 'long', day: 'numeric'})
  app.innerHTML += `<h2>${date}</h2>`
  const row = document.createElement('div')
  row.style.display = 'flex'
  periods.forEach(period => {
    const hour = period.startTime.split('T')[1].split(':')[0]
    row.innerHTML += `<div class="hourly">
      <img src="${period.icon}" alt="${period.shortForecast}" />
      <p>
        ${hour}:00
        <br />
        ${period.temperature}${period.temperatureUnit}
      </p>
    </div>`
  })
  app.appendChild(row)
}

const getHourlyForecast = data => {
  fetch(data.properties.forecastHourly)
    .then(res => res.json())
    .then(data => {
      const periods = data.properties.periods
      const days = periods.reduce((arr, period) => {
        arr[period.startTime.split('T')[0]] = arr[period.startTime.split('T')[0]] || []
        arr[period.startTime.split('T')[0]].push(period)
        return arr
      }, [])
      Object.keys(days).forEach((day, index) => {
        // if (index === 0) {
          generateToday(day, days[day])
        // }
      })
    })
}

const getPoints = coords => {
  fetch(`https://api.weather.gov/points/${coords.latitude},${coords.longitude}`)
    .then(res => res.json())
    .then(data => {
      getHourlyForecast(data)
    })
}

navigator.geolocation.getCurrentPosition(position => {
  const coords = {
    latitude: position.coords.latitude.toPrecision(6),
    longitude: position.coords.longitude.toPrecision(6),
  }
  getAlerts(coords)
  getPoints(coords)
})
