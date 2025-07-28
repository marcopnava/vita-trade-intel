// Market instruments configuration
export const FOREX_PAIRS = [
  'EURUSD=X', 'GBPUSD=X', 'USDJPY=X', 'USDCHF=X', 'AUDUSD=X', 'USDCAD=X',
  'NZDUSD=X', 'EURGBP=X', 'EURJPY=X', 'GBPJPY=X', 'EURCHF=X', 'GBPCHF=X',
  'CADCHF=X', 'AUDCHF=X', 'NZDCHF=X', 'AUDCAD=X', 'NZDCAD=X', 'AUDNZD=X'
];

export const INDICES = [
  '^GSPC', // S&P 500
  '^DJI',  // Dow Jones
  '^IXIC', // NASDAQ
  '^FTSE', // FTSE 100
  '^GDAXI', // DAX
  '^FCHI', // CAC 40
  '^N225', // Nikkei 225
  '^HSI',  // Hang Seng
  '^AXJO', // ASX 200
];

export const COMMODITIES = [
  'GC=F', // Gold
  'SI=F', // Silver
  'CL=F', // Crude Oil WTI
  'BZ=F', // Brent Crude
  'NG=F', // Natural Gas
  'ZC=F', // Corn
  'ZS=F', // Soybeans
  'ZW=F', // Wheat
];

export const CRYPTOCURRENCIES = [
  'BTC-USD', 'ETH-USD', 'BNB-USD', 'XRP-USD', 'ADA-USD', 
  'SOL-USD', 'DOGE-USD', 'DOT-USD', 'MATIC-USD', 'LTC-USD'
];

export const ALL_INSTRUMENTS = [
  ...FOREX_PAIRS,
  ...INDICES,
  ...COMMODITIES,
  ...CRYPTOCURRENCIES
];

// Data fetch intervals (in minutes)
export const FETCH_INTERVALS = {
  PRICES: 15,
  ECONOMIC_CALENDAR: 60,
  COT_DATA: 60 * 24 * 7, // Weekly
  NEWS: 10
};

// Yahoo Finance symbol mapping
export const SYMBOL_MAPPING: Record<string, string> = {
  'EUR/USD': 'EURUSD=X',
  'GBP/USD': 'GBPUSD=X',
  'USD/JPY': 'USDJPY=X',
  'GBP/JPY': 'GBPJPY=X',
  'Gold': 'GC=F',
  'Silver': 'SI=F',
  'Bitcoin': 'BTC-USD',
  'Ethereum': 'ETH-USD'
};