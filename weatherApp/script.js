const searchInput = document.querySelector('.weather-search')
const city = document.querySelector('.weather-city')
const day = document.querySelector('.weather-day')
const humidity = document.querySelector('.weather-indicator-humidity>.value')
const wind = document.querySelector('.weather-indicator-wind>.value')
const pressure = document.querySelector('.weather-indicator-pressure>.value')
const image = document.querySelector('.weather-image')
const temperature = document.querySelector('.weather-temp>.value')

const APIKey = 'd8bc3ea3b1087bf69d7d0583d416ae79'
const weatherBaseEndPoint = 'https://api.openweathermap.org/data/2.5/weather?units=metric&appid=' + APIKey

let getWeatherByCityName = async (city) => {
    let endPoint = weatherBaseEndPoint + '&q=' + city;
    let res = await fetch(endPoint)
    let data = await res.json()
    return data;
}

searchInput.addEventListener('keydown', async(e)=>{
    if (e.keyCode === 13) {
        let weather = await getWeatherByCityName(searchInput.value)
        updateCurrentWeather(weather);
        console.log(weather);
    }
})

let updateCurrentWeather = (data)=>{
    city.textContent = data.name + ', ' + data.sys.country
    day.textContent = dayOfWeek()
    humidity.textContent = data.main.humidity
    wind.textContent = windDirection(data.wind.deg) + ', ' + data.wind.speed
    pressure.textContent = data.main.pressure
    temperature.textContent = data.main.temp > 0 ? '+' + Math.round(data.main.temp): Math.round(data.main.temp)
}
    
    
let dayOfWeek = ()=>{
    return new Date().toLocaleDateString('en-EN', {'weekday': 'long'})

}

let windDirection = (deg)=>{
    if (45 < deg <= 135){
        return 'East'
    } else if(135 < deg <= 225){
        return 'South'
    } else if(225 < deg <= 315){
        return 'West'
    } else{
        return 'North'
    }


}