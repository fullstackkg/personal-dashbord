// // Load entire page before calling all other functions
loadData()

async function loadData() {

    try {

        await retrieveImage()
        await setInterval(renderDate, 1000)
        await setInterval(renderTime, 1000)
        await retrieveWeather()
        await returnCoinPrices()
        await retrieveQuote()

    } catch (e) {

        console.error(e)

    }
    
}


// Retrieving photo from UnSplash API
async function retrieveImage() {

    try {

        const response = await fetch("https://api.unsplash.com/photos/random?client_id=wMbFUY04yOZJdJpCMN_0Gz0JZSqdQae8U4NTzlAXiSg&orientation=landscape&query=galaxy")
        const responseData = await response.json()

        const authorName = responseData.user.name
        const image = responseData.urls.regular
        document.body.style.backgroundImage = `url("${image}")`
        document.querySelector("#author").innerText = `By: ${authorName}`

    } catch (e) {

        document.body.style.backgroundImage = `url("https://images.unsplash.com/photo-1516331138075-f3adc1e149cd?crop=entropy&cs=srgb&fm=jpg&ixid=M3w1MzYzMDJ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MDE2NDU3NzJ8&ixlib=rb-4.0.3&q=85")`
        document.querySelector("#author").innerText = "By: Alexander Andrews"

    }

}


// Retrieve coin information from the Coin Gecko API
async function returnCoinPrices() {

    try {

        const response = await fetch("https://api.coingecko.com/api/v3/coins/bitcoin")
        
        if(!response.ok) {

            throw Error("Something went wrong")
        
        } else {

            const responseData = await response.json()
    
            const coinImageEl = document.createElement("img")
            coinImageEl.setAttribute("id", "coin-img")
            coinImageEl.setAttribute("alt", "image-of-coin")
            coinImageEl.src = responseData.image.small

            
            const coinNameEl = document.createElement("p")
            coinNameEl.setAttribute("id", "coin-name")
            coinNameEl.innerText = responseData.name

            const currentPrice = document.createElement("p")
            currentPrice.setAttribute("id", "current-price")
            currentPrice.innerText = `🎯: ${
                responseData.market_data.current_price.usd.toLocaleString('en-US', 
                {
                    style: 'currency',
                    currency: 'USD'
                })
            }`
            
            const coin24high = document.createElement("p")
            coin24high.setAttribute("id", "coin-high")
            coin24high.innerText = `⬆️: ${
                responseData.market_data.high_24h.usd.toLocaleString('en-US', 
                {
                    style: 'currency',
                    currency: 'USD'
                })
            }`

            const coin24low = document.createElement("p")
            coin24low.setAttribute("id", "coin-low")
            coin24low.innerText = `⬇️: ${
                responseData.market_data.low_24h.usd.toLocaleString('en-US', 
                {
                    style: 'currency',
                    currency: 'USD'
                })
            }`

            document.querySelector(".coin-data-top").append(coinImageEl, coinNameEl)
            document.querySelector(".coin-data-bottom").append(currentPrice, coin24high, coin24low)
        
        }
        
    } catch (error) {

        console.error(error)
    
    }

}


//Update the time every second
function renderTime() {

    const date = new Date()
    document.querySelector(".time").innerText = date.toLocaleTimeString("en-us", {timeStyle:"short"})

}


//Update the date every 24 hours
function renderDate() {

    const date = new Date()
    const options = {
        weekday: "long", 
        year: "numeric",
        month: "long",
        day: "numeric"
    }
    document.querySelector(".date").innerText = date.toLocaleString('en-US', options)

}


//Returns the geolocation of coordinates so we can input into weather API
function returnCoordinates() {

    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(position => {
                const coordinatesObj = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                }

                resolve(coordinatesObj)
            },

            function(error) {
                reject(error)
            }
        )        
    })

}


//Retrieve the weather from user area using the OpenWeather API
async function retrieveWeather() {

    try {

        const coordinates = await returnCoordinates()
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.latitude}&lon=${coordinates.longitude}&units=metric&appid=61dd6de9dde9b9d94cd3692a53813c04`)
        if(!response.ok) {
            throw new Error("Weather currently unavailable")
        }

        const data = await response.json()

        document.querySelector("#weather-icon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`
        document.querySelector("#weather-city").innerText = `${data.name}`
        document.querySelector("#weather-temp").innerText = `${Math.round(data.main.temp)}°`

    } catch (e) {

        console.error(e)

    }

}


//Retrieving quote from the Quote API 
async function retrieveQuote() {

    try {
        
        const response = await fetch("https://api.quotable.io/quotes/random")
        if(response.status !== 200) {
            throw new Error()
        }

        const data = await response.json()
        document.querySelector("#quote").innerText = `"${data[0].content}" - ${data[0].author}`

    } catch (e) {

        document.querySelector("#quote").innerText = '"We make a living by what we get, but we make a life by what we give." - Winston Churchill'
    
    }

}