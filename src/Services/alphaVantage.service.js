import axios from 'axios'
import Asset from '../Models/asset.model.js'
import { io } from '../Web/socket.service.js'

export const fetchLivePrice = async (symbol) => {
  try {
    const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;

    const response = await axios.get(
      "https://apidojo-yahoo-finance-v1.p.rapidapi.com",
      {
        params: { symbols: symbol },
        headers: {
          "X-RapidAPI-Key": RAPIDAPI_KEY,
          "X-RapidAPI-Host": "yahoo-finance15.p.rapidapi.com",
        },
      }
    );

    const data = response.data.quotes?.[0];
    if (!data) throw new Error("Invalid response data");

    return {
      symbol: data.symbol,
      price: parseFloat(data.regularMarketPrice),
    };
  } catch (error) {
    console.error("Error fetching live data:", error.message);
    return null;
  }
};

export const updatePortfolioPrices = async () => {
  try {
    const assets = await Asset.find()
    for (let asset of assets) {
      const liveData = await fetchLivePrice(asset.symbol)
      if (liveData) {
        asset.currentPrice = liveData.price
        asset.totalValue = asset.quantity * asset.currentPrice
        await asset.save()
      }
    }

    const updatedAssets = await Asset.find()
    io.emit('portfolioUpdate', updatedAssets)
  } catch (error) {
    console.error('Error updating portfolio:', error)
  }
}

