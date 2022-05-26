import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [coords, setCoords] = useState({
    latitude: 0.0000,
    longitude: 0.0000,
  })

  const [point, setPoint] = useState(null)

  const [alerts, setAlerts] = useState([])

  const [hourlyForecasts, setHourlyForecasts] = useState([])

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      setCoords({
        latitude: position.coords.latitude.toPrecision(6),
        longitude: position.coords.longitude.toPrecision(6),
      })
    })
  }, [])

  useEffect(() => {
    if (coords.latitude === 0.0000 && coords.longitude === 0.0000) return

    fetch(`https://api.weather.gov/points/${coords.latitude},${coords.longitude}`)
      .then(res => res.json())
      .then(setPoint)
  }, [coords])

  useEffect(() => {
    if (coords.latitude === 0.0000 && coords.longitude === 0.0000) return

    fetch(`https://api.weather.gov/alerts/active?point=${coords.latitude},${coords.longitude}`)
      .then(res => res.json())
      .then(data => {
        setAlerts(data.features)
      })
  }, [coords])

  useEffect(() => {
    if (point === null) return

    fetch(point.properties.forecastHourly)
      .then(res => res.json())
      .then(data => {
        setHourlyForecasts(data.properties.periods)
      })
  }, [point])

  return (
    <div className="App">
      {alerts.length > 0 && <h1>Alerts</h1>}
      {alerts.length > 0 && (
        <ul>
          {alerts.map(alert => (
            <li key={alert.id}>
              <h2>{alert.properties.event}</h2>
              <p>{alert.properties.description}</p>
            </li>
          ))}
        </ul>
      )}
      <ul>
        {hourlyForecasts.map(period => (
          <li key={period.number}>{period.temperature}</li>
        ))}
      </ul>
    </div>
  )
}

export default App
