import React, { useState } from 'react';
import { VitaLogo } from '@/components/VitaLogo';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, PieChart, Clock, CheckCircle } from 'lucide-react';
import { MOCK_TRADES, MOCK_PORTFOLIOS } from '@/lib/mockData';
import { useAuth } from '@/hooks/useAuth';

const Portfolio: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('open');
  
  const portfolio = MOCK_PORTFOLIOS.find(p => p.user_id === user?.id) || MOCK_PORTFOLIOS[0];
  const openTrades = MOCK_TRADES.filter(t => t.status === 'open');
  const closedTrades = MOCK_TRADES.filter(t => t.status === 'closed');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
            <div className="text-sm text-muted-foreground">Portfolio Management</div>
          </div>
          <VitaLogo size="sm" showText={false} />
        </div>
      </header>

      <main className="vita-container py-8 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6">
          <Card className="vita-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Total Value</div>
                <div className="text-2xl font-semibold text-foreground">
                  {formatCurrency(portfolio.total_value)}
                </div>
              </div>
              <DollarSign className="w-8 h-8 text-primary" />
            </div>
          </Card>

          <Card className="vita-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Daily P&L</div>
                <div className={`text-2xl font-semibold ${portfolio.daily_pnl >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {portfolio.daily_pnl >= 0 ? '+' : ''}{formatCurrency(portfolio.daily_pnl)}
                </div>
              </div>
              {portfolio.daily_pnl >= 0 ? 
                <TrendingUp className="w-8 h-8 text-success" /> : 
                <TrendingDown className="w-8 h-8 text-destructive" />
              }
            </div>
          </Card>

          <Card className="vita-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Open Positions</div>
                <div className="text-2xl font-semibold text-foreground">{portfolio.open_positions}</div>
              </div>
              <PieChart className="w-8 h-8 text-info" />
            </div>
          </Card>

          <Card className="vita-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Risk Level</div>
                <div className={`text-2xl font-semibold capitalize ${
                  portfolio.risk_level === 'low' ? 'text-success' :
                  portfolio.risk_level === 'medium' ? 'text-warning' : 'text-destructive'
                }`}>
                  {portfolio.risk_level}
                </div>
              </div>
              <TrendingDown className={`w-8 h-8 ${
                portfolio.risk_level === 'low' ? 'text-success' :
                portfolio.risk_level === 'medium' ? 'text-warning' : 'text-destructive'
              }`} />
            </div>
          </Card>
        </div>

        {/* Trades Table */}
        <Card className="vita-card">
          <div className="p-6 border-b border-border">
            <h3 className="text-lg font-semibold">Trade History</h3>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="open" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Open Positions ({openTrades.length})
              </TabsTrigger>
              <TabsTrigger value="closed" className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Closed Trades ({closedTrades.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="open" className="mt-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Symbol</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Entry Price</TableHead>
                    <TableHead>Current Price</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>P&L</TableHead>
                    <TableHead>Opened</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {openTrades.map((trade) => (
                    <TableRow key={trade.id}>
                      <TableCell className="font-medium">{trade.symbol}</TableCell>
                      <TableCell>
                        <Badge variant={trade.type === 'buy' ? 'default' : 'secondary'}>
                          {trade.type.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>{trade.entry_price.toFixed(4)}</TableCell>
                      <TableCell>{trade.current_price.toFixed(4)}</TableCell>
                      <TableCell>{trade.quantity.toLocaleString()}</TableCell>
                      <TableCell className={trade.pnl >= 0 ? 'text-success' : 'text-destructive'}>
                        {trade.pnl >= 0 ? '+' : ''}{formatCurrency(trade.pnl)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDateTime(trade.opened_at)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="closed" className="mt-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Symbol</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Entry Price</TableHead>
                    <TableHead>Exit Price</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>P&L</TableHead>
                    <TableHead>Duration</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {closedTrades.map((trade) => (
                    <TableRow key={trade.id}>
                      <TableCell className="font-medium">{trade.symbol}</TableCell>
                      <TableCell>
                        <Badge variant={trade.type === 'buy' ? 'default' : 'secondary'}>
                          {trade.type.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>{trade.entry_price.toFixed(4)}</TableCell>
                      <TableCell>{trade.current_price.toFixed(4)}</TableCell>
                      <TableCell>{trade.quantity.toLocaleString()}</TableCell>
                      <TableCell className={trade.pnl >= 0 ? 'text-success' : 'text-destructive'}>
                        {trade.pnl >= 0 ? '+' : ''}{formatCurrency(trade.pnl)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDateTime(trade.opened_at)} - {trade.closed_at ? formatDateTime(trade.closed_at) : 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Account Summary */}
        <Card className="vita-card p-6">
          <h3 className="text-lg font-semibold mb-4">Account Summary</h3>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Balance</span>
                <span className="text-foreground font-medium">{formatCurrency(portfolio.total_value)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Margin Used</span>
                <span className="text-foreground font-medium">{formatCurrency(portfolio.margin_used)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Free Margin</span>
                <span className="text-foreground font-medium">{formatCurrency(portfolio.free_margin)}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Margin Level</span>
                <span className="text-success font-medium">{portfolio.margin_level.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Daily P&L %</span>
                <span className={`font-medium ${portfolio.daily_pnl_percentage >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {portfolio.daily_pnl_percentage >= 0 ? '+' : ''}{portfolio.daily_pnl_percentage.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Win Rate</span>
                <span className="text-success font-medium">72.4%</span>
              </div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Portfolio;