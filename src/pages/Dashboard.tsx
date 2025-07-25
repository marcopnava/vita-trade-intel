import React from 'react';
import { VitaLogo } from '@/components/VitaLogo';
import { WorldClocks } from '@/components/WorldClocks';
import { StatusPill } from '@/components/StatusPill';
import { Button } from '@/components/ui/button';

const Dashboard: React.FC = () => {
  const handleNavigation = (module: string) => {
    const routes: { [key: string]: string } = {
      services: '/portfolio',
      markets: '/analytics', 
      analytics: '/ai-engine',
      governance: '/governance',
      setup: '/protocol',
      platform: '/communication'
    };
    
    if (routes[module]) {
      window.location.href = routes[module];
    }
  };

  const getCurrentDate = () => {
    const now = new Date();
    return now.toLocaleDateString('it-IT', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };


  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <main className="vita-container py-16 space-y-12">
        {/* Header Section */}
        <div className="text-center space-y-6">
          <VitaLogo size="lg" showText={true} />
          
          <div className="text-sm text-muted-foreground border border-border rounded-lg px-4 py-2 inline-block">
            {getCurrentDate()}
          </div>
        </div>

        {/* World Clocks */}
        <WorldClocks />

        {/* Status Pills */}
        <div className="flex flex-wrap justify-center gap-4">
          <StatusPill variant="success" onClick={() => handleNavigation('services')}>
            Servizi base
          </StatusPill>
          <StatusPill variant="info" onClick={() => handleNavigation('markets')}>
            Mercati finanziari
          </StatusPill>
          <StatusPill variant="warning" onClick={() => handleNavigation('analytics')}>
            AI & Analytics
          </StatusPill>
          <StatusPill variant="success" onClick={() => handleNavigation('governance')}>
            Governance
          </StatusPill>
          <StatusPill variant="warning" onClick={() => handleNavigation('setup')}>
            Setup finale
          </StatusPill>
        </div>

        {/* Main CTA */}
        <div className="flex justify-center pt-8">
          <Button 
            size="lg" 
            className="bg-vita-gradient hover:shadow-vita-glow transition-all duration-300 px-8 py-3 text-base font-medium"
            onClick={() => handleNavigation('platform')}
          >
            Entra nella Piattaforma →
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 border-t border-border bg-background/80 backdrop-blur-sm">
        <div className="vita-container py-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div>• SISTEMA CARICATO E PRONTO ALL'USO</div>
            <div>v2.4.1</div>
            <div>Skip</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;