const searchInput = document.querySelector('.weather-search')
const city = document.querySelector('.weather-city')
const day = document.querySelector('.weather-day')
const humidity = document.querySelector('.weather-indicator-humidity>.value')
const wind = document.querySelector('.weather-indicator-wind>.value')
const pressure = document.querySelector('.weather-indicator-pressure>.value')
const image = document.querySelector('.weather-image')
const temperature = document.querySelector('.weather-temp>.value')

const forecastBlock = document.querySelector('.weather-forecast')

const APIKey = 'd8bc3ea3b1087bf69d7d0583d416ae79'
const weatherBaseEndPoint = 'https://api.openweathermap.org/data/2.5/weather?units=metric&appid=' + APIKey
const forecastBaseEndPoint = 'https://api.openweathermap.org/data/2.5/forecast?units=metric&appid=' + APIKey

let weatherImages = [
    {
        url: 'assets/images/clear-sky.png',
        ids: [800]
    },
    {
        url: 'assets/images/broken-clouds.png',
        ids: [803, 804]
    },
    {
        url: 'assets/images/few-clouds.png',
        ids: [801]
    },
    {
        url: 'assets/images/mist.png',
        ids: [701, 711, 721, 731, 741, 751, 761, 762, 771, 781]
    },
    {
        url: 'assets/images/rain.png',
        ids: [500, 501, 502, 503, 504]
    },
    {
        url: 'assets/images/scattered-clouds.png',
        ids: [802]
    },
    {
        url: 'assets/images/shower-rain.png',
        ids: [520, 521, 522, 531, 300, 301, 302, 311, 312, 313, 314, 321]
    },
    {
        url: 'assets/images/snow.png',
        ids: [511, 600, 602, 611, 612, 613, 615, 616, 620, 621, 622]
    },
    {
        url: 'assets/images/thunderstorm.png',
        ids: [200, 201, 202, 210, 211, 212, 221, 230, 231, 232]
    },

]

let getForecastById = async (id)=>{
    let endPoint = forecastBaseEndPoint + '&id=' + id
    let res = await fetch(endPoint)
    let forecast = await res.json()
    let forecastList = forecast.list
    let daily = []
    forecastList.forEach(element => {
        if (new Date(element.dt_txt).getHours() == 12) {
            daily.push(element)
        }
    });
    
    return daily

}

let getWeatherByCityName = async (city) => {
    let endPoint = weatherBaseEndPoint + '&q=' + city;
    let res = await fetch(endPoint)
    let data = await res.json()
    return data;
}

searchInput.addEventListener('keydown', async(e)=>{
    if (e.keyCode === 13) {
        let weather = await getWeatherByCityName(searchInput.value)
        const cityId = weather.id
        let forecast = await getForecastById(cityId)
        updateCurrentWeather(weather);
        updateForecast(forecast)
    }
})

let updateCurrentWeather = (data)=>{
    city.textContent = data.name + ', ' + data.sys.country
    day.textContent = dayOfWeek()
    humidity.textContent = data.main.humidity
    wind.textContent = windDirection(data.wind.deg) + ', ' + data.wind.speed
    pressure.textContent = data.main.pressure
    temperature.textContent = data.main.temp > 0 ? '+' + Math.round(data.main.temp): Math.round(data.main.temp)
    let imgId = data.weather[0].id
    weatherImages.forEach((obj)=>{
        if (obj.ids.includes(imgId)) {
            image.src = obj.url
        }
    })
}
 
let updateForecast = (data)=>{
    forecastBlock.innerHTML = ''
    data.forEach(day => {
        let iconUrl = 'http://openweathermap.org/img/wn/' + day.weather[0].icon + '@2x.png'
        let dayName = dayOfWeek(day.dt * 1000)
        let temperature = day.main.temp > 0 ? '+' + Math.round(day.main.temp): Math.round(day.main.temp)
        let forecastItem = `
            <article class="weather-forecast-item">
                <img src=${iconUrl} alt=${day.weather[0].description} class="weather-forecast-icon">
                <h3 class="weather-forecast-day">${dayName}</h3>
                <p class="weather-forecast-temp"><span class="value">${temperature}</span>&deg;C</p>
            </article>`;
        forecastBlock.insertAdjacentHTML('beforeend', forecastItem)
    });
}
    
let dayOfWeek = (dt = new Date().getTime())=>{
    return new Date(dt).toLocaleDateString('en-EN', {'weekday': 'long'})

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