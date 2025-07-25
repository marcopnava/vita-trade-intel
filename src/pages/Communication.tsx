import React from 'react';
import { VitaLogo } from '@/components/VitaLogo';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, MessageSquare, Users, Send } from 'lucide-react';

const Communication: React.FC = () => {
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
            <div className="text-sm text-muted-foreground">Communication Hub</div>
          </div>
          <VitaLogo size="sm" showText={false} />
        </div>
      </header>

      <main className="vita-container py-8">
        <div className="grid grid-cols-4 gap-6 h-[calc(100vh-200px)]">
          <Card className="vita-card p-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Channels
            </h3>
            <div className="space-y-2">
              {[
                { name: 'General Trading', active: true, unread: 3 },
                { name: 'AI Signals', active: false, unread: 0 },
                { name: 'Risk Management', active: false, unread: 1 },
                { name: 'Market Analysis', active: false, unread: 0 },
              ].map((channel, index) => (
                <div key={index} className={`p-3 rounded cursor-pointer transition-colors ${
                  channel.active ? 'bg-primary/10 border border-primary/20' : 'hover:bg-muted/50'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{channel.name}</span>
                    {channel.unread > 0 && (
                      <span className="text-xs bg-primary text-primary-foreground rounded-full px-2 py-1">
                        {channel.unread}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-medium text-muted-foreground mb-3">Direct Messages</h4>
              <div className="space-y-2">
                {[
                  { name: 'Francesco Casella', status: 'online' },
                  { name: 'Marco Paolo Nava', status: 'online' },
                  { name: 'Andrea Roberto', status: 'away' },
                  { name: 'Giorgio Greco', status: 'offline' },
                ].map((user, index) => (
                  <div key={index} className="flex items-center space-x-3 p-2 rounded hover:bg-muted/50 cursor-pointer">
                    <div className={`w-2 h-2 rounded-full ${
                      user.status === 'online' ? 'bg-success' : 
                      user.status === 'away' ? 'bg-warning' : 'bg-muted-foreground'
                    }`} />
                    <span className="text-sm text-foreground">{user.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card className="vita-card col-span-3 flex flex-col">
            <div className="border-b border-border p-4">
              <h3 className="text-lg font-semibold flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                General Trading
              </h3>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {[
                {
                  user: 'Francesco Casella',
                  time: '10:30 AM',
                  message: 'EUR/USD showing strong momentum. AI engine confirms bullish sentiment.',
                  isOwn: false
                },
                {
                  user: 'Marco Paolo Nava', 
                  time: '10:32 AM',
                  message: 'Agreed. COT data also supports long position.',
                  isOwn: false
                },
                {
                  user: 'You',
                  time: '10:35 AM', 
                  message: 'Proposal TRP-001 submitted for EUR/USD long. Please review.',
                  isOwn: true
                },
                {
                  user: 'Andrea Roberto',
                  time: '10:40 AM',
                  message: 'Checking the risk metrics now. Looks good so far.',
                  isOwn: false
                }
              ].map((msg, index) => (
                <div key={index} className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.isOwn 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-foreground'
                  }`}>
                    {!msg.isOwn && (
                      <div className="text-xs font-medium mb-1">{msg.user}</div>
                    )}
                    <div className="text-sm">{msg.message}</div>
                    <div className={`text-xs mt-1 ${
                      msg.isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    }`}>
                      {msg.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border p-4">
              <div className="flex space-x-2">
                <input 
                  type="text" 
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 border border-border rounded bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <Button size="sm" className="px-3">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Communication;