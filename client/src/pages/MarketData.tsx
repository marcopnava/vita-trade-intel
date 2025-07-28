import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { TrendingUp, TrendingDown, Clock, Globe, DollarSign, BarChart3 } from 'lucide-react';

interface Price {
  id: number;
  symbol: string;
  timeframe: string;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  timestamp: string;
}

interface NewsItem {
  id: number;
  headline: string;
  summary: string;
  source: string;
  link: string;
  publishedAt: string;
  impact: string;
}

interface EconomicEvent {
  id: number;
  country: string;
  title: string;
  impact: string;
  actual: string;
  forecast: string;
  previous: string;
  eventTime: string;
}

const MAJOR_PAIRS = ['EURUSD=X', 'GBPUSD=X', 'USDJPY=X', 'USDCHF=X'];

export default function MarketData() {
  const [selectedPair, setSelectedPair] = useState('EURUSD=X');
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch price data for selected pair
  const { data: priceData, refetch: refetchPrices } = useQuery({
    queryKey: ['/api/market/prices', selectedPair],
    queryFn: async () => {
      const response = await fetch(`/api/market/prices?symbol=${selectedPair}&limit=10`);
      return response.json() as Promise<Price[]>;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch latest news
  const { data: newsData, refetch: refetchNews } = useQuery({
    queryKey: ['/api/market/news'],
    queryFn: async () => {
      const response = await fetch('/api/market/news?limit=10');
      return response.json() as Promise<NewsItem[]>;
    },
    refetchInterval: 60000, // Refresh every minute
  });

  // Fetch economic events
  const { data: economicEvents } = useQuery({
    queryKey: ['/api/market/events'],
    queryFn: async () => {
      const response = await fetch('/api/market/events?limit=10');
      return response.json() as Promise<EconomicEvent[]>;
    },
    refetchInterval: 300000, // Refresh every 5 minutes
  });

  // Manual data update
  const handleUpdateData = async (type: string) => {
    setIsUpdating(true);
    try {
      await fetch('/api/update-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type })
      });
      
      // Refetch relevant data
      if (type === 'prices' || type === 'all') {
        refetchPrices();
      }
      if (type === 'news' || type === 'all') {
        refetchNews();
      }
      
    } catch (error) {
      console.error('Update failed:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const formatPrice = (price: string) => parseFloat(price).toFixed(5);
  const formatTime = (timestamp: string) => new Date(timestamp).toLocaleTimeString();

  const getPriceChange = (current: Price, previous?: Price) => {
    if (!previous) return 0;
    const currentPrice = parseFloat(current.close);
    const previousPrice = parseFloat(previous.close);
    return currentPrice - previousPrice;
  };

  const currentPrice = priceData?.[0];
  const previousPrice = priceData?.[1];
  const priceChange = currentPrice && previousPrice ? getPriceChange(currentPrice, previousPrice) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Real-Time Market Data</h1>
          <p className="text-muted-foreground">Live prices, news, and economic events</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => handleUpdateData('prices')} 
            disabled={isUpdating}
            variant="outline"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Update Prices
          </Button>
          <Button 
            onClick={() => handleUpdateData('news')} 
            disabled={isUpdating}
            variant="outline"
          >
            <Globe className="w-4 h-4 mr-2" />
            Update News
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Price Data */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Live Prices
            </CardTitle>
            <div className="flex gap-2">
              {MAJOR_PAIRS.map(pair => (
                <Button
                  key={pair}
                  variant={selectedPair === pair ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedPair(pair)}
                >
                  {pair.replace('=X', '').replace('USD', '/USD')}
                </Button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            {currentPrice ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-2xl font-bold">
                      {formatPrice(currentPrice.close)}
                    </div>
                    <div className={`flex items-center gap-1 text-sm ${
                      priceChange >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {priceChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(5)}
                    </div>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <div>Updated: {formatTime(currentPrice.timestamp)}</div>
                    <div>H: {formatPrice(currentPrice.high)} L: {formatPrice(currentPrice.low)}</div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h4 className="font-semibold">Recent Price History</h4>
                  <div className="space-y-1">
                    {priceData.slice(1, 6).map((price, index) => (
                      <div key={price.id} className="flex justify-between text-sm">
                        <span>{formatTime(price.timestamp)}</span>
                        <span>{formatPrice(price.close)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                No price data available. Click "Update Prices" to fetch data.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Economic Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Economic Calendar
            </CardTitle>
            <CardDescription>Upcoming economic events</CardDescription>
          </CardHeader>
          <CardContent>
            {economicEvents && economicEvents.length > 0 ? (
              <div className="space-y-3">
                {economicEvents.slice(0, 5).map(event => (
                  <div key={event.id} className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        event.impact === 'high' ? 'destructive' : 
                        event.impact === 'medium' ? 'default' : 'secondary'
                      } className="text-xs">
                        {event.impact}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{event.country}</span>
                    </div>
                    <div className="text-sm font-medium">{event.title}</div>
                    {event.forecast && (
                      <div className="text-xs text-muted-foreground">
                        Forecast: {event.forecast}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                No economic events available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* News Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Financial News Feed
          </CardTitle>
          <CardDescription>Latest market news and analysis</CardDescription>
        </CardHeader>
        <CardContent>
          {newsData && newsData.length > 0 ? (
            <div className="space-y-4">
              {newsData.map(news => (
                <div key={news.id} className="space-y-2">
                  <div className="flex items-start justify-between">
                    <h4 className="font-semibold text-sm leading-tight flex-1">
                      <a 
                        href={news.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {news.headline}
                      </a>
                    </h4>
                    <div className="flex items-center gap-2 ml-4">
                      {news.impact && (
                        <Badge variant="outline" className="text-xs">
                          {news.impact}
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(news.publishedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{news.source}</span>
                  </div>
                  {news.summary && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {news.summary}
                    </p>
                  )}
                  <Separator />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Globe className="w-12 h-12 mx-auto mb-4 opacity-50" />
              No news data available. Click "Update News" to fetch latest headlines.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}