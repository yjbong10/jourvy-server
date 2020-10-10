const weatherHandler = (fetch) => (req, res) => {
    const { lat, lon, city } = req.body;
    
    const api = '95dba826bb98dc37089236796d7afeca';
    const viaLocation = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${api}`
    const viaCityName = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${api}`
    const url = (lat && lon) ? viaLocation : viaCityName
    fetch(url)
        .then(response => response.json())
        .then(data => res.json(data))
        .catch(err => res.json('something is wrong :('))
}

module.exports = {
    weatherHandler: weatherHandler
}