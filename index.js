const express = require('express');
const https = require("https");
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => res.sendFile(__dirname + "/index.html"));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
app.post('/weather', function (req, res) {
    const cityname = req.body.cityname
    const api = '04f6b08d1a2a5233d91f346f7ee13e6a'
    const url = 'https://api.openweathermap.org/data/2.5/weather?q='+cityname+'&units=metric&appid='+api
    https.get(url, (response) => {

        let data = ''
        response.on('data', (chunk) => {
            data+=chunk
        })
        response.on('end',() => {
            const weatherdata = JSON.parse(data)
            const weather = weatherdata.main.temp 
            const icon = weatherdata.weather[0].icon
            const description = weatherdata.weather[0].description
            const feels = weatherdata.main.feels_like
            const windspeed = weatherdata.wind.speed
            const pressure = weatherdata.main.pressure
            const humidity = weatherdata.main.humidity
            const imageurl =  'https://openweathermap.org/img/wn/'+icon+'@2x.png'
            const rainVolume = (weatherdata.rain && weatherdata.rain['3h'])
            res.write('<h1>The temperature in '+cityname+' is '+weather + 'and the weather is'+description+'</h1>')
            res.write('<h1>feels '+feels+ ', humidity is '+humidity+'%, windspeed is '+windspeed+'m/s SSE, pressure '+pressure+'hPA,' + rainVolume + '</h1>')
            res.write('<img src='+imageurl+'>')
            res.send()
        })
    })
})
app.post('/movie', function (req, res) {
    const api = "2f6fd0d5";
    const movie = req.body.movie;
    const url = "https://www.omdbapi.com/?t="+movie+"&apikey="+api;
    https.get(url, (response) => {
        let data = "";

        response.on("data", (chunk) => {
            data += chunk;
        });

        response.on("end", () => {
            try {
                const movieData = JSON.parse(data);
                const poster = movieData.Poster;
                const year = movieData.Year;
                const released = movieData.Released;
                const plot = movieData.Plot;
                const title = movieData.Title;
                res.send(`<h4>Title: ${title}</h4><h4>Year: ${year}</h4><h4>Released: ${released}</h4><h4>Plot: ${plot}</h4><img src="${poster}" alt="Movie Poster">`);

            } catch (error) {
                res.status(500).send("Error fetching movie data.");
            }
        });
    }); //I used gpt for error handling
});

app.post('/ip', function (req, res) {
    const ip = req.body.ip
    const apiip = '28181724e47044aa8f2ba8538fadb52c'
    const ipurl = 'https://ipgeolocation.abstractapi.com/v1/?api_key='+apiip+'&ip_address='+ip
    https.get(ipurl, (response) => {
        let data = ''
        response.on('data', (chunk) => {
            data+=chunk
        })
        response.on('end', () =>{
            try {
                const ips = JSON.parse(data)
                const country =ips.country
                const city = ips.city
                const flag = ips.flag.png
                const currency = ips.currency.currency_name
                res.send('<h1>country: ' + country + ', city: ' + city + ', currency_name: ' + currency + '</h1> <img src="' + flag + '">');

            } catch (error) {
                res.status(500).send("Error" + error)
            }
        })
    })
})
