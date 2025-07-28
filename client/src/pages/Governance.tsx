import React from 'react';
import { VitaLogo } from '@/components/VitaLogo';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Vote, CheckCircle, Clock, Users } from 'lucide-react';

const Governance: React.FC = () => {
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
            <div className="text-sm text-muted-foreground">Trade Governance</div>
          </div>
          <VitaLogo size="sm" showText={false} />
        </div>
      </header>

      <main className="vita-container py-8 space-y-8">
        <div className="grid grid-cols-4 gap-6">
          <Card className="vita-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Pending Votes</div>
                <div className="text-2xl font-semibold text-foreground">3</div>
              </div>
              <Vote className="w-8 h-8 text-warning" />
            </div>
          </Card>

          <Card className="vita-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Approved Today</div>
                <div className="text-2xl font-semibold text-foreground">7</div>
              </div>
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
          </Card>

          <Card className="vita-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">In Review</div>
                <div className="text-2xl font-semibold text-foreground">2</div>
              </div>
              <Clock className="w-8 h-8 text-info" />
            </div>
          </Card>

          <Card className="vita-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Total Members</div>
                <div className="text-2xl font-semibold text-foreground">4</div>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <Card className="vita-card p-6">
            <h3 className="text-lg font-semibold mb-4">Active Proposals</h3>
            <div className="space-y-4">
              {[
                { 
                  id: 'TRP-001', 
                  trade: 'EUR/USD Long', 
                  proposer: 'AI Engine', 
                  votes: '2/5', 
                  status: 'Pending' 
                },
                { 
                  id: 'TRP-002', 
                  trade: 'GBP/JPY Short', 
                  proposer: 'Marco Paolo', 
                  votes: '3/5', 
                  status: 'Pending' 
                },
                { 
                  id: 'TRP-003', 
                  trade: 'USD/CHF Long', 
                  proposer: 'AI Engine', 
                  votes: '1/5', 
                  status: 'Pending' 
                },
              ].map((proposal, index) => (
                <div key={index} className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">{proposal.id}</span>
                    <span className="text-xs px-2 py-1 rounded bg-warning/20 text-warning">
                      {proposal.status}
                    </span>
                  </div>
                  <div className="text-sm text-foreground mb-1">{proposal.trade}</div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>By: {proposal.proposer}</span>
                    <span>Votes: {proposal.votes}</span>
                  </div>
                  <div className="mt-3 flex space-x-2">
                    <Button size="sm" variant="outline" className="text-xs">
                      View Details
                    </Button>
                    <Button size="sm" className="text-xs bg-success hover:bg-success/80">
                      Vote Approve
                    </Button>
                    <Button size="sm" variant="destructive" className="text-xs">
                      Vote Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="vita-card p-6">
            <h3 className="text-lg font-semibold mb-4">Voting Members</h3>
            <div className="space-y-3">
              {[
                { name: 'Francesco Casella', role: 'Head of Trading', votes: '2 votes', status: 'Active' },
                { name: 'Marco Paolo Nava', role: 'Trader', votes: '1 vote', status: 'Active' },
                { name: 'Andrea Roberto', role: 'Trader', votes: '1 vote', status: 'Active' },
                { name: 'Giorgio Greco', role: 'Trader', votes: '1 vote', status: 'Away' },
              ].map((member, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <div>
                    <div className="font-medium text-foreground">{member.name}</div>
                    <div className="text-xs text-muted-foreground">{member.role}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-foreground">{member.votes}</div>
                    <div className={`text-xs ${
                      member.status === 'Active' ? 'text-success' : 'text-warning'
                    }`}>
                      {member.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="vita-card p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Decisions</h3>
          <div className="space-y-3">
            {[
              { id: 'TRP-099', trade: 'AUD/NZD Short', result: 'Approved', votes: '4/5', time: '2 hours ago' },
              { id: 'TRP-098', trade: 'USD/CAD Long', result: 'Approved', votes: '5/5', time: '4 hours ago' },
              { id: 'TRP-097', trade: 'EUR/GBP Short', result: 'Rejected', votes: '2/5', time: '6 hours ago' },
            ].map((decision, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                <div className="flex items-center space-x-4">
                  <span className="font-medium text-foreground">{decision.id}</span>
                  <span className="text-sm text-foreground">{decision.trade}</span>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-muted-foreground">{decision.votes}</span>
                  <span className={`px-2 py-1 rounded ${
                    decision.result === 'Approved' ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'
                  }`}>
                    {decision.result}
                  </span>
                  <span className="text-muted-foreground">{decision.time}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Governance;