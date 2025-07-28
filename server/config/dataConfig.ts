// Data ingestion configuration
export const DATA_CONFIG = {
  // RSS News feeds (public ones that work without authentication)
  NEWS_FEEDS: [
    'https://feeds.finance.yahoo.com/rss/2.0/headline',
    'https://feeds.marketwatch.com/marketwatch/topstories/',
    'https://feeds.bloomberg.com/markets/news.rss', // Sometimes works
    'https://www.investing.com/rss/news.rss'
  ],

  // Yahoo Finance rate limiting (milliseconds between requests)
  RATE_LIMITS: {
    YAHOO_FINANCE: 100,
    RSS_FEEDS: 1000,
    FOREX_FACTORY: 2000
  },

  // Data retention (days)
  RETENTION: {
    PRICES: 30,
    NEWS: 7,
    ECONOMIC_EVENTS: 30,
    COT_DATA: 365
  },

  // High-impact economic indicators to prioritize
  HIGH_IMPACT_KEYWORDS: [
    'nfp', 'non-farm payroll', 'unemployment rate', 'inflation',
    'gdp', 'federal reserve', 'fed', 'interest rate', 'cpi',
    'employment', 'jobless claims', 'retail sales', 'manufacturing'
  ],

  // Symbol aliases for easier mapping
  SYMBOL_ALIASES: {
    'EURUSD': 'EURUSD=X',
    'GBPUSD': 'GBPUSD=X',
    'USDJPY': 'USDJPY=X',
    'GOLD': 'GC=F',
    'BITCOIN': 'BTC-USD',
    'SPX': '^GSPC',
    'NASDAQ': '^IXIC'
  }
};

export const TRADING_HOURS = {
  // Major forex session times (UTC)
  SYDNEY: { start: 21, end: 6 },
  TOKYO: { start: 23, end: 8 },
  LONDON: { start: 7, end: 16 },
  NEW_YORK: { start: 12, end: 21 }
};

// Market status based on current UTC time
export function getMarketStatus(): string {
  const hour = new Date().getUTCHours();
  
  if ((hour >= 21 && hour <= 23) || (hour >= 0 && hour <= 6)) {
    return 'Sydney/Asian Session';
  } else if (hour >= 7 && hour <= 11) {
    return 'London Session';
  } else if (hour >= 12 && hour <= 16) {
    return 'London/NY Overlap';
  } else if (hour >= 17 && hour <= 20) {
    return 'New York Session';
  } else {
    return 'Market Closed';
  }
}