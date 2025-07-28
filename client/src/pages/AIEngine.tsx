import React from 'react';
import { VitaLogo } from '@/components/VitaLogo';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Brain, Activity, AlertTriangle, TrendingUp } from 'lucide-react';

const AIEngine: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="vita-container py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.location.href = '/dashboard'}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
            <div className="text-sm text-muted-foreground">AI Trade Engine</div>
          </div>
          <VitaLogo size="sm" showText={false} />
        </div>
      </header>

      <main className="vita-container py-8 space-y-8">
        <div className="grid grid-cols-3 gap-6">
          <Card className="vita-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">AI Confidence</div>
                <div className="text-2xl font-semibold text-foreground">87.5%</div>
              </div>
              <Brain className="w-8 h-8 text-primary" />
            </div>
          </Card>

          <Card className="vita-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Active Signals</div>
                <div className="text-2xl font-semibold text-foreground">4</div>
              </div>
              <Activity className="w-8 h-8 text-success" />
            </div>
          </Card>

          <Card className="vita-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Risk Score</div>
                <div className="text-2xl font-semibold text-warning">Medium</div>
              </div>
              <AlertTriangle className="w-8 h-8 text-warning" />
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <Card className="vita-card p-6">
            <h3 className="text-lg font-semibold mb-4">Current Trade Proposals</h3>
            <div className="space-y-4">
              {[
                { pair: 'EUR/USD', action: 'BUY', confidence: '92%', strength: 'Strong' },
                { pair: 'GBP/JPY', action: 'SELL', confidence: '78%', strength: 'Medium' },
                { pair: 'USD/CHF', action: 'BUY', confidence: '85%', strength: 'Strong' },
              ].map((proposal, index) => (
                <div key={index} className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">{proposal.pair}</span>
                    <span className={`text-sm px-2 py-1 rounded ${
                      proposal.action === 'BUY' ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'
                    }`}>
                      {proposal.action}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Confidence: {proposal.confidence}</span>
                    <span>Strength: {proposal.strength}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="vita-card p-6">
            <h3 className="text-lg font-semibold mb-4">Market Sentiment</h3>
            <div className="space-y-4">
              {[
                { market: 'Forex', sentiment: 'Bullish', score: '+0.72' },
                { market: 'Commodities', sentiment: 'Neutral', score: '+0.12' },
                { market: 'Indices', sentiment: 'Bearish', score: '-0.34' },
                { market: 'Crypto', sentiment: 'Bullish', score: '+0.58' },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <span className="font-medium text-foreground">{item.market}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">{item.sentiment}</span>
                    <span className={`text-sm font-medium ${
                      parseFloat(item.score) > 0 ? 'text-success' : parseFloat(item.score) < 0 ? 'text-destructive' : 'text-muted-foreground'
                    }`}>
                      {item.score}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="vita-card p-6">
          <h3 className="text-lg font-semibold mb-4">AI Analysis Pipeline</h3>
          <div className="grid grid-cols-4 gap-4 text-center">
            {[
              { step: 'Data Ingestion', status: 'Active', icon: Activity },
              { step: 'Vector Processing', status: 'Active', icon: Brain },
              { step: 'Signal Generation', status: 'Active', icon: TrendingUp },
              { step: 'Risk Assessment', status: 'Complete', icon: AlertTriangle },
            ].map((item, index) => (
              <div key={index} className="border border-border rounded-lg p-4">
                <item.icon className="w-6 h-6 mx-auto mb-2 text-primary" />
                <div className="text-sm font-medium text-foreground">{item.step}</div>
                <div className="text-xs text-success mt-1">{item.status}</div>
              </div>
            ))}
          </div>
        </Card>
      </main>
    </div>
  );
};

export default AIEngine;