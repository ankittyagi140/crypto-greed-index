# Crypto Greed Index

A comprehensive cryptocurrency market sentiment analysis platform that displays the Crypto Fear & Greed Index, providing real-time insights into market sentiment. This powerful tool helps traders and investors make more informed decisions by visualizing market psychology through advanced metrics and interactive dashboards.

**Live App:** [CryptoGreedIndex.com](https://www.cryptogreedindex.com)

## What is the Crypto Greed Index?

The Crypto Greed Index measures the emotional driving force behind cryptocurrency market movements, quantifying investor sentiment on a scale from extreme fear to extreme greed. By analyzing multiple data sources including volatility, market momentum, social media sentiment, and trading volume, this index provides a valuable contrarian indicator:

- **Extreme Fear (0-25)**: Often signals that investors are overly worried, potentially representing buying opportunities
- **Fear (26-45)**: Indicates caution in the market
- **Neutral (46-55)**: Balanced market sentiment
- **Greed (56-75)**: Signals bullish investor psychology
- **Extreme Greed (76-100)**: May indicate the market is due for a correction

## Why Use CryptoGreedIndex.com?

- **Comprehensive Analysis**: Access to fear & greed metrics combined with price correlation data
- **Multi-Timeframe Views**: Track sentiment across different time periods (daily, weekly, monthly)
- **Interactive Visualizations**: Beautiful, responsive charts powered by modern web technologies
- **Market Context**: View fear & greed data alongside critical market indicators like Bitcoin dominance and total market capitalization
- **Mobile Optimized**: Full functionality across all devices
- **Fast & Reliable**: Built with performance in mind - updates every 12 hours with reliable data

## Features

- Real-time Crypto Fear & Greed Index display
- Interactive charts and visualizations using Recharts
- Smooth animations with Framer Motion
- Modern UI with Tailwind CSS
- Toast notifications for important updates
- Responsive design for all devices
- Historical data comparison
- Social sentiment analysis
- Market dominance tracking
- Bitcoin price correlation

## Tech Stack

- **Framework:** Next.js 15.2.1
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Animations:** Framer Motion
- **Icons:** React Icons
- **Notifications:** React Hot Toast

## API Integration

The application integrates with several APIs to provide comprehensive market data:

### Fear & Greed Index API
- **Endpoint:** `/api/fear-greed`
- **Source:** alternative.me
- **Features:**
  - Real-time fear & greed index value
  - Historical data with customizable time range
  - Market sentiment classification
  - Updates every 12 hours

### Global Market Data API
- **Endpoint:** `/api/global`
- **Source:** CoinGecko
- **Features:**
  - Total market capitalization
  - 24-hour trading volume
  - BTC and ETH dominance
  - Market cap and volume changes
  - Combined with fear & greed data

### Bitcoin Price API
- **Endpoint:** `/api/bitcoin-price`
- **Source:** CoinGecko
- **Features:**
  - Historical Bitcoin price data
  - Price change percentages
  - Integration with fear & greed index for correlation analysis

### Social Sentiment API
- **Endpoint:** `/api/social-sentiment`
- **Features:**
  - Social media sentiment analysis
  - Historical sentiment trends
  - Correlation with market movements

### Rate Limiting
- API calls are cached for 5 minutes
- Rate limit handling for external APIs
- Error handling and fallback mechanisms

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/crypto-greed-index.git
cd crypto-greed-index
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### Available Scripts

- `npm run dev` - Start the development server with Turbopack
- `npm run build` - Build the production application
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code linting

## Project Structure

```
crypto-greed-index/
├── src/              # Source code
├── public/           # Static assets
├── .next/           # Next.js build output
└── node_modules/    # Dependencies
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [Recharts](https://recharts.org/) for the beautiful charts
- [Framer Motion](https://www.framer.com/motion/) for the smooth animations
