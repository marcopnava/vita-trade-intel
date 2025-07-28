import axios from 'axios';
import * as cheerio from 'cheerio';
import Parser from 'rss-parser';
import { format, subDays, isValid } from 'date-fns';
import { db } from '../db';
import { prices, economicEvents, cotData, newsItems } from '../../shared/schema';
import { ALL_INSTRUMENTS, FOREX_PAIRS, FETCH_INTERVALS } from '../config/instruments';
import { eq, and, gte } from 'drizzle-orm';

const rssParser = new Parser();

interface YahooFinanceData {
  symbol: string;
  timestamp: number[];
  open: number[];
  high: number[];
  low: number[];
  close: number[];
  volume: number[];
}

interface EconomicEvent {
  time: string;
  country: string;
  impact: string;
  event: string;
  actual: string;
  forecast: string;
  previous: string;
}

export class MarketDataFetcher {
  private static instance: MarketDataFetcher;
  private logger: Console;

  constructor() {
    this.logger = console;
  }

  public static getInstance(): MarketDataFetcher {
    if (!MarketDataFetcher.instance) {
      MarketDataFetcher.instance = new MarketDataFetcher();
    }
    return MarketDataFetcher.instance;
  }

  /**
   * Fetch OHLC price data from Yahoo Finance
   */
  async fetchPrices(): Promise<void> {
    this.logger.log('🔄 Fetching price data...');
    
    try {
      const endTime = Math.floor(Date.now() / 1000);
      const startTime = endTime - (7 * 24 * 60 * 60); // Last 7 days
      
      for (const symbol of ALL_INSTRUMENTS) {
        try {
          const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`;
          const params = {
            period1: startTime,
            period2: endTime,
            interval: '15m',
            includePrePost: false
          };

          const response = await axios.get(url, { params });
          const data = response.data?.chart?.result?.[0];
          
          if (!data || !data.timestamp) {
            this.logger.warn(`⚠️ No data for ${symbol}`);
            continue;
          }

          const timestamps = data.timestamp;
          const quote = data.indicators?.quote?.[0];
          
          if (!quote) continue;

          const priceData = [];
          for (let i = 0; i < timestamps.length; i++) {
            const timestamp = new Date(timestamps[i] * 1000);
            
            // Skip if any required data is missing
            if (!quote.open[i] || !quote.high[i] || !quote.low[i] || !quote.close[i]) {
              continue;
            }

            priceData.push({
              symbol: symbol,
              timeframe: '15m',
              open: quote.open[i].toString(),
              high: quote.high[i].toString(),
              low: quote.low[i].toString(),
              close: quote.close[i].toString(),
              volume: quote.volume?.[i]?.toString() || '0',
              timestamp: timestamp
            });
          }

          if (priceData.length > 0) {
            // Insert new data, avoiding duplicates
            for (const price of priceData) {
              try {
                const existing = await db.select()
                  .from(prices)
                  .where(and(
                    eq(prices.symbol, price.symbol),
                    eq(prices.timeframe, price.timeframe),
                    eq(prices.timestamp, price.timestamp)
                  ))
                  .limit(1);

                if (existing.length === 0) {
                  await db.insert(prices).values(price);
                }
              } catch (error) {
                // Skip duplicate entries silently
              }
            }
            
            this.logger.log(`✅ Updated ${symbol}: ${priceData.length} records`);
          }

          // Rate limiting
          await new Promise(resolve => setTimeout(resolve, 100));
          
        } catch (error) {
          this.logger.error(`❌ Error fetching ${symbol}:`, error);
        }
      }
      
      this.logger.log('✅ Price data fetch completed');
    } catch (error) {
      this.logger.error('❌ Price fetch failed:', error);
      throw error;
    }
  }

  /**
   * Fetch economic calendar from ForexFactory
   */
  async fetchEconomicCalendar(): Promise<void> {
    this.logger.log('🔄 Fetching economic calendar...');
    
    try {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const url = 'https://www.forexfactory.com/calendar';
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      const $ = cheerio.load(response.data);
      const events: any[] = [];

      $('.calendar__row').each((i, element) => {
        const $row = $(element);
        
        const time = $row.find('.calendar__time').text().trim();
        const country = $row.find('.calendar__country').attr('title') || '';
        const impact = $row.find('.calendar__impact').find('span').attr('class')?.includes('high') ? 'high' :
                      $row.find('.calendar__impact').find('span').attr('class')?.includes('medium') ? 'medium' : 'low';
        const event = $row.find('.calendar__event').text().trim();
        const actual = $row.find('.calendar__actual').text().trim();
        const forecast = $row.find('.calendar__forecast').text().trim();
        const previous = $row.find('.calendar__previous').text().trim();

        if (event && country) {
          const eventTime = this.parseEventTime(time, today);
          
          events.push({
            country,
            title: event,
            impact,
            actual: actual || null,
            forecast: forecast || null,
            previous: previous || null,
            eventTime
          });
        }
      });

      // Insert events into database
      for (const event of events) {
        try {
          const existing = await db.select()
            .from(economicEvents)
            .where(and(
              eq(economicEvents.title, event.title),
              eq(economicEvents.eventTime, event.eventTime)
            ))
            .limit(1);

          if (existing.length === 0) {
            await db.insert(economicEvents).values(event);
          }
        } catch (error) {
          // Skip duplicates
        }
      }

      this.logger.log(`✅ Economic calendar updated: ${events.length} events`);
      
    } catch (error) {
      this.logger.error('❌ Economic calendar fetch failed:', error);
      throw error;
    }
  }

  /**
   * Fetch COT (Commitment of Traders) data
   */
  async fetchCOTData(): Promise<void> {
    this.logger.log('🔄 Fetching COT data...');
    
    try {
      // CFTC publishes COT data weekly, typically on Friday
      const url = 'https://www.cftc.gov/dea/newcot/FinFutWk.txt';
      
      const response = await axios.get(url);
      const lines = response.data.split('\n');
      
      // Skip header line
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const fields = line.split(',').map((field: string) => field.replace(/"/g, '').trim());
        
        if (fields.length >= 15) {
          const reportDate = new Date(fields[2]);
          if (!isValid(reportDate)) continue;
          
          const symbol = this.mapCFTCSymbol(fields[0]);
          if (!symbol) continue;
          
          const cotEntries = [
            {
              symbol,
              traderType: 'commercial',
              longPositions: fields[5] || '0',
              shortPositions: fields[6] || '0',
              netPositions: (parseInt(fields[5] || '0') - parseInt(fields[6] || '0')).toString(),
              reportDate
            },
            {
              symbol,
              traderType: 'non_commercial',
              longPositions: fields[7] || '0',
              shortPositions: fields[8] || '0',
              netPositions: (parseInt(fields[7] || '0') - parseInt(fields[8] || '0')).toString(),
              reportDate
            }
          ];

          for (const entry of cotEntries) {
            try {
              const existing = await db.select()
                .from(cotData)
                .where(and(
                  eq(cotData.symbol, entry.symbol),
                  eq(cotData.traderType, entry.traderType),
                  eq(cotData.reportDate, entry.reportDate)
                ))
                .limit(1);

              if (existing.length === 0) {
                await db.insert(cotData).values(entry);
              }
            } catch (error) {
              // Skip errors
            }
          }
        }
      }
      
      this.logger.log('✅ COT data updated');
      
    } catch (error) {
      this.logger.error('❌ COT data fetch failed:', error);
      throw error;
    }
  }

  /**
   * Fetch financial news from RSS feeds
   */
  async fetchNews(): Promise<void> {
    this.logger.log('🔄 Fetching financial news...');
    
    const newsFeeds = [
      'https://feeds.bloomberg.com/markets/news.rss',
      'https://www.reuters.com/business/finance/rss',
      'https://feeds.content.dowjones.io/public/rss/mw_topstories'
    ];

    try {
      for (const feedUrl of newsFeeds) {
        try {
          const feed = await rssParser.parseURL(feedUrl);
          
          for (const item of feed.items) {
            if (!item.title || !item.link || !item.pubDate) continue;
            
            const publishedAt = new Date(item.pubDate);
            if (!isValid(publishedAt)) continue;

            const newsItem = {
              headline: item.title,
              summary: item.contentSnippet || item.content || null,
              source: feed.title || 'Unknown',
              link: item.link,
              publishedAt,
              sentiment: null, // Could be enhanced with sentiment analysis
              impact: this.assessNewsImpact(item.title)
            };

            try {
              const existing = await db.select()
                .from(newsItems)
                .where(eq(newsItems.link, newsItem.link))
                .limit(1);

              if (existing.length === 0) {
                await db.insert(newsItems).values(newsItem);
              }
            } catch (error) {
              // Skip duplicates
            }
          }
          
          // Rate limiting between feeds
          await new Promise(resolve => setTimeout(resolve, 1000));
          
        } catch (error) {
          this.logger.error(`❌ Error fetching feed ${feedUrl}:`, error);
        }
      }
      
      this.logger.log('✅ News fetch completed');
      
    } catch (error) {
      this.logger.error('❌ News fetch failed:', error);
      throw error;
    }
  }

  /**
   * Get data fetch status
   */
  async getDataStatus(): Promise<any> {
    try {
      const [priceCount] = await db.select({ count: 'count(*)' }).from(prices);
      const [eventCount] = await db.select({ count: 'count(*)' }).from(economicEvents);
      const [cotCount] = await db.select({ count: 'count(*)' }).from(cotData);
      const [newsCount] = await db.select({ count: 'count(*)' }).from(newsItems);

      // Get latest timestamps
      const latestPrice = await db.select({ timestamp: prices.timestamp })
        .from(prices)
        .orderBy(prices.timestamp)
        .limit(1);
      
      const latestEvent = await db.select({ timestamp: economicEvents.createdAt })
        .from(economicEvents)
        .orderBy(economicEvents.createdAt)
        .limit(1);

      const latestNews = await db.select({ timestamp: newsItems.publishedAt })
        .from(newsItems)
        .orderBy(newsItems.publishedAt)
        .limit(1);

      return {
        prices: {
          count: priceCount?.count || 0,
          lastUpdate: latestPrice[0]?.timestamp || null
        },
        economicEvents: {
          count: eventCount?.count || 0,
          lastUpdate: latestEvent[0]?.timestamp || null
        },
        cotData: {
          count: cotCount?.count || 0
        },
        news: {
          count: newsCount?.count || 0,
          lastUpdate: latestNews[0]?.timestamp || null
        }
      };
    } catch (error) {
      this.logger.error('❌ Error getting data status:', error);
      return { error: 'Failed to get status' };
    }
  }

  // Helper methods
  private parseEventTime(timeStr: string, baseDate: Date): Date {
    if (!timeStr || timeStr === 'All Day') {
      return baseDate;
    }
    
    const [time, period] = timeStr.split(/\s*(am|pm)/i);
    if (!time) return baseDate;
    
    const [hours, minutes = '0'] = time.split(':');
    let hour = parseInt(hours) || 0;
    
    if (period?.toLowerCase() === 'pm' && hour !== 12) {
      hour += 12;
    } else if (period?.toLowerCase() === 'am' && hour === 12) {
      hour = 0;
    }
    
    const eventDate = new Date(baseDate);
    eventDate.setHours(hour, parseInt(minutes) || 0, 0, 0);
    
    return eventDate;
  }

  private mapCFTCSymbol(cftcName: string): string | null {
    const mapping: Record<string, string> = {
      'EURO FX - CHICAGO MERCANTILE EXCHANGE': 'EUR/USD',
      'BRITISH POUND STERLING - CHICAGO MERCANTILE EXCHANGE': 'GBP/USD',
      'JAPANESE YEN - CHICAGO MERCANTILE EXCHANGE': 'USD/JPY',
      'GOLD - COMMODITY EXCHANGE INC.': 'Gold',
      'SILVER - COMMODITY EXCHANGE INC.': 'Silver',
      'LIGHT SWEET CRUDE OIL - NEW YORK MERCANTILE EXCHANGE': 'Crude Oil'
    };
    
    return mapping[cftcName] || null;
  }

  private assessNewsImpact(headline: string): string {
    const highImpactKeywords = ['fed', 'inflation', 'gdp', 'employment', 'rate', 'crisis', 'war'];
    const mediumImpactKeywords = ['earnings', 'trade', 'policy', 'election', 'bank'];
    
    const headlineLower = headline.toLowerCase();
    
    if (highImpactKeywords.some(keyword => headlineLower.includes(keyword))) {
      return 'high';
    } else if (mediumImpactKeywords.some(keyword => headlineLower.includes(keyword))) {
      return 'medium';
    }
    
    return 'low';
  }
}

export const marketDataFetcher = MarketDataFetcher.getInstance();