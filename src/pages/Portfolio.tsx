import React from 'react';
import { VitaLogo } from '@/components/VitaLogo';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, PieChart } from 'lucide-react';

const Portfolio: React.FC = () => {
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
            <div className="text-sm text-muted-foreground">Portfolio Tracking</div>
          </div>
          <VitaLogo size="sm" showText={false} />
        </div>
      </header>

      <main className="vita-container py-8 space-y-8">
        <div className="grid grid-cols-4 gap-6">
          <Card className="vita-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Total Value</div>
                <div className="text-2xl font-semibold text-foreground">$247,382.50</div>
              </div>
              <DollarSign className="w-8 h-8 text-primary" />
            </div>
          </Card>

          <Card className="vita-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Daily P&L</div>
                <div className="text-2xl font-semibold text-success">+$3,247.80</div>
              </div>
              <TrendingUp className="w-8 h-8 text-success" />
            </div>
          </Card>

          <Card className="vita-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Open Positions</div>
                <div className="text-2xl font-semibold text-foreground">12</div>
              </div>
              <PieChart className="w-8 h-8 text-info" />
            </div>
          </Card>

          <Card className="vita-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Risk Level</div>
                <div className="text-2xl font-semibold text-warning">Medium</div>
              </div>
              <TrendingDown className="w-8 h-8 text-warning" />
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <Card className="vita-card p-6">
            <h3 className="text-lg font-semibold mb-4">Active Positions</h3>
            <div className="space-y-3">
              {['EUR/USD', 'GBP/JPY', 'USD/CHF', 'AUD/NZD'].map((pair) => (
                <div key={pair} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <span className="font-medium text-foreground">{pair}</span>
                  <span className="text-sm text-success">+127.50</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="vita-card p-6">
            <h3 className="text-lg font-semibold mb-4">Account Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Balance</span>
                <span className="text-foreground">$247,382.50</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Margin Used</span>
                <span className="text-foreground">$12,340.15</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Free Margin</span>
                <span className="text-foreground">$235,042.35</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Margin Level</span>
                <span className="text-success">1,904.2%</span>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Portfolio;