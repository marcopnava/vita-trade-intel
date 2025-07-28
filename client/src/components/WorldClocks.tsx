import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Clock } from 'lucide-react';

interface MarketClock {
  city: string;
  timezone: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

const marketClocks: MarketClock[] = [
  { city: 'MILANO', timezone: 'Europe/Rome', isOpen: false, openTime: '09:00', closeTime: '17:30' },
  { city: 'LONDON', timezone: 'Europe/London', isOpen: false, openTime: '08:00', closeTime: '16:30' },
  { city: 'NEW YORK', timezone: 'America/New_York', isOpen: false, openTime: '09:30', closeTime: '16:00' },
  { city: 'TOKYO', timezone: 'Asia/Tokyo', isOpen: false, openTime: '09:00', closeTime: '15:00' },
  { city: 'SYDNEY', timezone: 'Australia/Sydney', isOpen: false, openTime: '10:00', closeTime: '16:00' }
];

export const WorldClocks: React.FC = () => {
  const [times, setTimes] = useState<{ [key: string]: string }>({});
  const [marketStatus, setMarketStatus] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const updateTimes = () => {
      const newTimes: { [key: string]: string } = {};
      const newMarketStatus: { [key: string]: boolean } = {};

      marketClocks.forEach(market => {
        const now = new Date();
        const marketTime = new Date(now.toLocaleString("en-US", { timeZone: market.timezone }));
        newTimes[market.city] = marketTime.toLocaleTimeString('en-US', { 
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });

        // Simplified market hours check (weekdays only)
        const isWeekday = marketTime.getDay() >= 1 && marketTime.getDay() <= 5;
        const currentHour = marketTime.getHours();
        const currentMinute = marketTime.getMinutes();
        const currentTimeInMinutes = currentHour * 60 + currentMinute;
        
        const [openHour, openMin] = market.openTime.split(':').map(Number);
        const [closeHour, closeMin] = market.closeTime.split(':').map(Number);
        const openTimeInMinutes = openHour * 60 + openMin;
        const closeTimeInMinutes = closeHour * 60 + closeMin;

        newMarketStatus[market.city] = isWeekday && 
          currentTimeInMinutes >= openTimeInMinutes && 
          currentTimeInMinutes <= closeTimeInMinutes;
      });

      setTimes(newTimes);
      setMarketStatus(newMarketStatus);
    };

    updateTimes();
    const interval = setInterval(updateTimes, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="vita-card p-6 max-w-4xl mx-auto">
      <div className="grid grid-cols-5 gap-6">
        {marketClocks.map((market) => (
          <div key={market.city} className="text-center space-y-3">
            <div className="flex items-center justify-center space-x-2">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-trading-xs text-foreground">
                {market.city}
              </span>
            </div>
            <div className="text-lg font-mono text-primary font-medium">
              {times[market.city] || '00:00:00'}
            </div>
            <div className="flex items-center justify-center space-x-1">
              <div 
                className={`w-2 h-2 rounded-full ${
                  marketStatus[market.city] ? 'bg-success' : 'bg-destructive'
                }`}
              />
              <span className="text-xs text-muted-foreground">
                {marketStatus[market.city] ? 'Open' : 'Closed'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};