import React from 'react';
import { VitaLogo } from '@/components/VitaLogo';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, FileText, Edit, Save, Lock } from 'lucide-react';

const Protocol: React.FC = () => {
  const [isEditing, setIsEditing] = React.useState(false);

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
            <div className="text-sm text-muted-foreground">Trading Protocol</div>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center space-x-2"
            >
              {isEditing ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
              <span>{isEditing ? 'Save Changes' : 'Edit Protocol'}</span>
            </Button>
            <VitaLogo size="sm" showText={false} />
          </div>
        </div>
      </header>

      <main className="vita-container py-8 space-y-8">
        <div className="grid grid-cols-4 gap-6">
          <Card className="vita-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Protocol Version</div>
                <div className="text-2xl font-semibold text-foreground">v2.4.1</div>
              </div>
              <FileText className="w-8 h-8 text-primary" />
            </div>
          </Card>

          <Card className="vita-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Last Updated</div>
                <div className="text-2xl font-semibold text-foreground">3 days ago</div>
              </div>
              <Edit className="w-8 h-8 text-info" />
            </div>
          </Card>

          <Card className="vita-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Access Level</div>
                <div className="text-2xl font-semibold text-foreground">Admin</div>
              </div>
              <Lock className="w-8 h-8 text-warning" />
            </div>
          </Card>

          <Card className="vita-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Sections</div>
                <div className="text-2xl font-semibold text-foreground">8</div>
              </div>
              <FileText className="w-8 h-8 text-success" />
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-4 gap-8">
          <Card className="vita-card p-6">
            <h3 className="text-lg font-semibold mb-4">Table of Contents</h3>
            <div className="space-y-2">
              {[
                { section: '1. Trading Principles', active: true },
                { section: '2. Risk Management', active: false },
                { section: '3. AI Integration', active: false },
                { section: '4. Governance Rules', active: false },
                { section: '5. Position Sizing', active: false },
                { section: '6. Market Analysis', active: false },
                { section: '7. Emergency Protocols', active: false },
                { section: '8. Performance Review', active: false },
              ].map((item, index) => (
                <div key={index} className={`p-2 rounded cursor-pointer transition-colors ${
                  item.active ? 'bg-primary/10 border border-primary/20' : 'hover:bg-muted/50'
                }`}>
                  <div className="text-sm text-foreground">{item.section}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="vita-card p-6 col-span-3">
            <h3 className="text-lg font-semibold mb-4">1. Trading Principles</h3>
            <div className={`prose prose-sm max-w-none ${
              isEditing ? 'bg-muted/20 border border-border rounded p-4' : ''
            }`}>
              {isEditing ? (
                <textarea 
                  className="w-full h-96 bg-transparent border-none resize-none focus:outline-none text-foreground"
                  defaultValue={`# Core Trading Principles

## 1.1 Risk-First Approach
All trading decisions must prioritize capital preservation. No single trade should risk more than 2% of total account balance.

## 1.2 Data-Driven Decisions
Every trade proposal must be supported by:
- Technical analysis
- Fundamental analysis
- AI sentiment analysis
- Risk/reward calculation

## 1.3 Collaborative Decision Making
All trades above $10,000 exposure require team vote:
- Francesco Casella: 2 votes (Head of Trading)
- Marco Paolo Nava: 1 vote
- Andrea Roberto: 1 vote  
- Giorgio Greco: 1 vote

Minimum 3 votes required for approval.

## 1.4 Continuous Learning
Weekly review sessions to analyze:
- Winning trades: what worked
- Losing trades: lessons learned
- Market conditions: adaptations needed

## 1.5 Technology Integration
VITA platform is our primary tool for:
- Market analysis
- Trade proposals
- Risk monitoring
- Performance tracking
- Communication

## 1.6 Emotional Discipline
Trading decisions based on system and analysis, not emotions. Mandatory cooling-off period for major losses.`}
                />
              ) : (
                <div className="space-y-4 text-foreground">
                  <h2 className="text-xl font-semibold">Core Trading Principles</h2>
                  
                  <div className="space-y-3">
                    <h3 className="text-lg font-medium">1.1 Risk-First Approach</h3>
                    <p className="text-muted-foreground">
                      All trading decisions must prioritize capital preservation. No single trade should risk more than 2% of total account balance.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-medium">1.2 Data-Driven Decisions</h3>
                    <p className="text-muted-foreground">Every trade proposal must be supported by:</p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                      <li>Technical analysis</li>
                      <li>Fundamental analysis</li>
                      <li>AI sentiment analysis</li>
                      <li>Risk/reward calculation</li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-medium">1.3 Collaborative Decision Making</h3>
                    <p className="text-muted-foreground">All trades above $10,000 exposure require team vote:</p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                      <li>Francesco Casella: 2 votes (Head of Trading)</li>
                      <li>Marco Paolo Nava: 1 vote</li>
                      <li>Andrea Roberto: 1 vote</li>
                      <li>Giorgio Greco: 1 vote</li>
                    </ul>
                    <p className="text-muted-foreground">Minimum 3 votes required for approval.</p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-medium">1.4 Continuous Learning</h3>
                    <p className="text-muted-foreground">Weekly review sessions to analyze:</p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                      <li>Winning trades: what worked</li>
                      <li>Losing trades: lessons learned</li>
                      <li>Market conditions: adaptations needed</li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-medium">1.5 Technology Integration</h3>
                    <p className="text-muted-foreground">VITA platform is our primary tool for:</p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                      <li>Market analysis</li>
                      <li>Trade proposals</li>
                      <li>Risk monitoring</li>
                      <li>Performance tracking</li>
                      <li>Communication</li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-medium">1.6 Emotional Discipline</h3>
                    <p className="text-muted-foreground">
                      Trading decisions based on system and analysis, not emotions. Mandatory cooling-off period for major losses.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Protocol;