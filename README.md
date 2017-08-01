## Fetch all the coins:

```
# Get the response from: https://www.cryptocompare.com/api/data/coinlist/
data = {} //Paste the response here
responseData = data.Data
let allCoins = []

Object.keys(responseData).forEach((d) => {
    allCoins.push({
        name: responseData[d].CoinName,
        image: 'https://www.cryptocompare.com' + responseData[d].ImageUrl,
    })
})

```
