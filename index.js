const topDiv = document.querySelector('.top-div')
const bottomDiv = document.querySelector('.bottom-div')

// // Load entire page before calling all other functions
loadData()

async function loadData() {
  try {
    await retrieveImage()
    renderTime()
    renderDate()
    setInterval(renderTime, 1000)
    setInterval(renderDate, 60 * 60 * 1000)
    await returnCoinPrices()
    await retrieveWeather()
    await retrieveQuote()
  } catch (e) {
    console.error('Error:', error)
  }
}

// Retrieving photo from UnSplash API
async function retrieveImage() {
  try {
    const response = await fetch(
      'https://api.unsplash.com/photos/random?client_id=wMbFUY04yOZJdJpCMN_0Gz0JZSqdQae8U4NTzlAXiSg&orientation=landscape&query=galaxy'
    )
    const responseData = await response.json()
    const { user, urls } = responseData

    const authorName = user.name
    const image = urls.regular
    document.body.style.backgroundImage = `url("${image}")`

    const author = document.createElement('p')
    author.setAttribute('id', 'author')
    author.innerText = `By: ${authorName}`
    bottomDiv.append(author)
  } catch (e) {
    document.body.style.backgroundImage = `url("https://images.unsplash.com/photo-1516331138075-f3adc1e149cd?crop=entropy&cs=srgb&fm=jpg&ixid=M3w1MzYzMDJ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MDE2NDU3NzJ8&ixlib=rb-4.0.3&q=85")`
    const author = document.createElement('p')
    author.setAttribute('id', 'author')
    author.innerText = 'By: Alexander Andrews'
    bottomDiv.append(author)
  }
}

// Retrieve coin information from the Coin Gecko API
async function returnCoinPrices(coin = 'bitcoin') {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coin}`
    )

    if (!response.ok) {
      throw Error('Something went wrong')
    } else {
      const responseData = await response.json()
      const { image, name, market_data } = responseData

      const coinData = document.createElement('div')
      coinData.classList.add('coin-data')
      coinData.setAttribute('id', 'coin-data')

      const coinDataTop = document.createElement('div')
      coinDataTop.classList.add('coin-data-top')

      const coinDataBottom = document.createElement('div')
      coinDataBottom.classList.add('coin-data-bottom')

      const coinImageLink = document.createElement('a')
      coinImageLink.setAttribute('href', '#')

      const coinImageEl = document.createElement('img')
      coinImageEl.setAttribute('id', 'coin-img')
      coinImageEl.setAttribute('alt', 'image-of-coin')
      coinImageEl.src = image.small

      const coinNameEl = document.createElement('p')
      coinNameEl.setAttribute('id', 'coin-name')
      coinNameEl.innerText = name

      const currentPrice = document.createElement('p')
      currentPrice.setAttribute('id', 'current-price')
      currentPrice.innerText = `🎯: ${market_data.current_price.usd.toLocaleString(
        'en-US',
        {
          style: 'currency',
          currency: 'USD',
        }
      )}`

      const coin24high = document.createElement('p')
      coin24high.setAttribute('id', 'coin-high')
      coin24high.innerText = `⬆️: ${market_data.high_24h.usd.toLocaleString(
        'en-US',
        {
          style: 'currency',
          currency: 'USD',
        }
      )}`

      const coin24low = document.createElement('p')
      coin24low.setAttribute('id', 'coin-low')
      coin24low.innerText = `⬇️: ${market_data.low_24h.usd.toLocaleString(
        'en-US',
        {
          style: 'currency',
          currency: 'USD',
        }
      )}`

      coinImageLink.append(coinImageEl)
      coinDataTop.append(coinImageLink, coinNameEl)
      coinDataBottom.append(currentPrice, coin24high, coin24low)
      coinData.append(coinDataTop, coinDataBottom)
      topDiv.prepend(coinData)
    }
  } catch (error) {
    returnCoinPrices()
    console.error('Coin not found', error)
  }
}

// Eventlistener for to change coins
document.addEventListener('click', (e) => {
  if (e.target.id === 'coin-img') {
    const newCoin = document.createElement('input')
    newCoin.placeholder = 'Search coins'
    newCoin.setAttribute('type', 'search')
    newCoin.setAttribute('id', 'coin-search')

    const oldCoin = document.getElementById('coin-name')
    oldCoin.replaceWith(newCoin)

    const searchInput = document.getElementById('coin-search')
    const coinData = document.getElementById('coin-data')
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && searchInput.value.trim() !== '') {
        coinData.remove()
        returnCoinPrices(searchInput.value)
      }
    })
  }
})

//Update the time every second
function renderTime() {
  const date = new Date()
  document.querySelector('.time').innerText = date.toLocaleTimeString('en-us', {
    timeStyle: 'short',
  })
}

//Update the date every 24 hours
function renderDate() {
  const date = new Date()
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  document.querySelector('.date').innerText = date.toLocaleString(
    'en-US',
    options
  )
}

//Returns the geolocation of coordinates so we can input into weather API
function returnCoordinates() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coordinatesObj = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }

        resolve(coordinatesObj)
      },

      function (error) {
        reject(error)
      }
    )
  })
}

//Retrieve the weather from user area using the OpenWeather API
async function retrieveWeather() {
  try {
    const coordinates = await returnCoordinates()
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.latitude}&lon=${coordinates.longitude}&units=metric&appid=61dd6de9dde9b9d94cd3692a53813c04`
    )
    if (!response.ok) {
      throw new Error('Weather currently unavailable')
    }

    const data = await response.json()
    const { weather, name, main } = data

    const weatherData = document.createElement('div')
    weatherData.classList.add('weather-data')

    const weatherIcon = document.createElement('img')
    weatherIcon.setAttribute('id', 'weather-icon')
    weatherIcon.setAttribute('alt', 'weather-icon')
    weatherIcon.setAttribute(
      'src',
      `https://openweathermap.org/img/wn/${weather[0].icon}.png`
    )

    const weatherTemp = document.createElement('p')
    weatherTemp.setAttribute('id', 'weather-temp')
    weatherTemp.innerText = `${Math.round(main.temp)}°`

    const weatherCity = document.createElement('p')
    weatherCity.setAttribute('id', 'weather-city')
    weatherCity.innerText = `${name}`

    weatherData.append(weatherIcon, weatherTemp, weatherCity)
    topDiv.append(weatherData)
  } catch (e) {
    console.error('Error:', e)
  }
}

//Retrieving quote from the Quote API
async function retrieveQuote() {
  try {
    const response = await fetch('https://api.quotable.io/quotes/random')
    if (response.status !== 200) {
      throw new Error()
    }

    const data = await response.json()

    const quote = document.createElement('p')
    quote.setAttribute('id', 'quote')
    quote.innerText = `"${data[0].content}" - ${data[0].author}`
    bottomDiv.append(quote)
  } catch (e) {
    const quote = document.createElement('p')
    quote.setAttribute('id', 'quote')
    quote.innerText =
      '"We make a living by what we get, but we make a life by what we give." - Winston Churchill'
    bottomDiv.append(quote)
  }
}
