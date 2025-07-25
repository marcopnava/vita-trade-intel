import React from 'react';
import { VitaLogo } from '@/components/VitaLogo';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, BarChart3, TrendingUp, Globe, Calendar } from 'lucide-react';

const Analytics: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="vita-container py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.location.href = '/'}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
            <div className="text-sm text-muted-foreground">Market Analytics</div>
          </div>
          <VitaLogo size="sm" showText={false} />
        </div>
      </header>

      <main className="vita-container py-8 space-y-8">
        <div className="grid grid-cols-4 gap-6">
          <Card className="vita-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Market Volatility</div>
                <div className="text-2xl font-semibold text-foreground">12.7%</div>
              </div>
              <BarChart3 className="w-8 h-8 text-primary" />
            </div>
          </Card>

          <Card className="vita-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Trend Strength</div>
                <div className="text-2xl font-semibold text-foreground">Strong</div>
              </div>
              <TrendingUp className="w-8 h-8 text-success" />
            </div>
          </Card>

          <Card className="vita-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Global Sentiment</div>
                <div className="text-2xl font-semibold text-foreground">Bullish</div>
              </div>
              <Globe className="w-8 h-8 text-info" />
            </div>
          </Card>

          <Card className="vita-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Events Today</div>
                <div className="text-2xl font-semibold text-foreground">8</div>
              </div>
              <Calendar className="w-8 h-8 text-warning" />
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-3 gap-8">
          <Card className="vita-card p-6 col-span-2">
            <h3 className="text-lg font-semibold mb-4">Major Currency Pairs</h3>
            <div className="space-y-3">
              {[
                { pair: 'EUR/USD', price: '1.0875', change: '+0.0023', percent: '+0.21%' },
                { pair: 'GBP/USD', price: '1.2634', change: '-0.0045', percent: '-0.35%' },
                { pair: 'USD/JPY', price: '149.85', change: '+0.87', percent: '+0.58%' },
                { pair: 'USD/CHF', price: '0.8923', change: '+0.0012', percent: '+0.13%' },
                { pair: 'AUD/USD', price: '0.6587', change: '-0.0034', percent: '-0.51%' },
                { pair: 'USD/CAD', price: '1.3654', change: '+0.0089', percent: '+0.66%' },
              ].map((pair, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <span className="font-medium text-foreground">{pair.pair}</span>
                  <div className="flex items-center space-x-4">
                    <span className="text-foreground">{pair.price}</span>
                    <span className={`text-sm ${
                      parseFloat(pair.change) > 0 ? 'text-success' : 'text-destructive'
                    }`}>
                      {pair.change} ({pair.percent})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="vita-card p-6">
            <h3 className="text-lg font-semibold mb-4">Economic Calendar</h3>
            <div className="space-y-3">
              {[
                { time: '09:30', event: 'GDP (YoY)', country: 'EUR', impact: 'High' },
                { time: '11:00', event: 'CPI Flash', country: 'GBP', impact: 'Medium' },
                { time: '14:30', event: 'NFP', country: 'USD', impact: 'High' },
                { time: '16:00', event: 'Fed Speech', country: 'USD', impact: 'Medium' },
              ].map((event, index) => (
                <div key={index} className="border border-border rounded p-3">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs text-muted-foreground">{event.time}</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      event.impact === 'High' ? 'bg-destructive/20 text-destructive' : 'bg-warning/20 text-warning'
                    }`}>
                      {event.impact}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-foreground">{event.event}</div>
                  <div className="text-xs text-muted-foreground">{event.country}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="vita-card p-6">
          <h3 className="text-lg font-semibold mb-4">Market Correlation Matrix</h3>
          <div className="grid grid-cols-7 gap-2 text-xs">
            <div></div>
            {['EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF', 'AUD/USD', 'USD/CAD'].map((pair) => (
              <div key={pair} className="text-center font-medium text-muted-foreground p-2">
                {pair.split('/')[0]}
              </div>
            ))}
            {[
              ['EUR', '1.00', '0.78', '-0.34', '-0.89', '0.67', '-0.45'],
              ['GBP', '0.78', '1.00', '-0.23', '-0.67', '0.56', '-0.34'],
              ['JPY', '-0.34', '-0.23', '1.00', '0.45', '-0.12', '0.23'],
              ['CHF', '-0.89', '-0.67', '0.45', '1.00', '-0.56', '0.34'],
              ['AUD', '0.67', '0.56', '-0.12', '-0.56', '1.00', '-0.23'],
              ['CAD', '-0.45', '-0.34', '0.23', '0.34', '-0.23', '1.00'],
            ].map((row, rowIndex) => (
              <React.Fragment key={rowIndex}>
                <div className="font-medium text-muted-foreground p-2 text-center">
                  {row[0]}
                </div>
                {row.slice(1).map((value, colIndex) => (
                  <div key={colIndex} className={`p-2 text-center rounded ${
                    parseFloat(value) > 0.5 ? 'bg-success/20 text-success' :
                    parseFloat(value) < -0.5 ? 'bg-destructive/20 text-destructive' :
                    'bg-muted/50 text-muted-foreground'
                  }`}>
                    {value}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Analytics;