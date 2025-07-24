import React from 'react';
import { VitaLogo } from '@/components/VitaLogo';
import { WorldClocks } from '@/components/WorldClocks';
import { NavigationCard } from '@/components/NavigationCard';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Brain, 
  Users, 
  MessageSquare, 
  FileText, 
  Bell,
  BarChart3,
  Shield
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const handleNavigation = (module: string) => {
    console.log(`Navigating to ${module} module`);
    // TODO: Implement navigation logic
  };

  const navigationModules = [
    {
      title: 'Portfolio Tracking',
      description: 'Monitor accounts, trades, and performance metrics across all Key to Markets positions',
      icon: TrendingUp,
      status: 'active' as const,
      action: () => handleNavigation('portfolio')
    },
    {
      title: 'AI Trade Engine',
      description: 'AI-powered analysis with vectorized data from news, COT reports, and market intelligence',
      icon: Brain,
      status: 'maintenance' as const,
      action: () => handleNavigation('ai-engine')
    },
    {
      title: 'Governance Panel',
      description: 'Weighted voting system for trade proposals with full audit trail and decision tracking',
      icon: Users,
      status: 'maintenance' as const,
      action: () => handleNavigation('governance')
    },
    {
      title: 'Communication Hub',
      description: 'Internal team chat, trade discussions, and proposal collaboration tools',
      icon: MessageSquare,
      status: 'inactive' as const,
      action: () => handleNavigation('communication')
    },
    {
      title: 'Market Analytics',
      description: 'TradingView integration with advanced charting and technical analysis tools',
      icon: BarChart3,
      status: 'inactive' as const,
      action: () => handleNavigation('analytics')
    },
    {
      title: 'Trading Protocol',
      description: 'Internal guidelines, methodology documentation, and risk management protocols',
      icon: FileText,
      status: 'active' as const,
      action: () => handleNavigation('protocol')
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <VitaLogo size="md" showText={true} />
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Shield className="w-4 h-4" />
              </Button>
              <div className="text-sm text-muted-foreground">
                Francesco Casella
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold bg-vita-gradient bg-clip-text text-transparent">
            Welcome to VITA Trading Floor
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Virtual Investment Technology Assistant - Your comprehensive trading intelligence platform 
            for portfolio management, AI-driven analysis, and collaborative decision making.
          </p>
          <div className="text-sm text-muted-foreground">
            Giovedì 24 luglio 2025
          </div>
        </div>

        {/* World Clocks */}
        <div className="flex justify-center">
          <WorldClocks />
        </div>

        {/* Navigation Modules */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-center">Platform Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {navigationModules.map((module, index) => (
              <NavigationCard
                key={index}
                title={module.title}
                description={module.description}
                icon={module.icon}
                status={module.status}
                onClick={module.action}
              />
            ))}
          </div>
        </div>

        {/* Quick Access Button */}
        <div className="flex justify-center pt-8">
          <Button 
            size="lg" 
            className="bg-vita-gradient hover:shadow-vita-glow transition-all duration-300"
            onClick={() => handleNavigation('portfolio')}
          >
            Entra nella Piattaforma →
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
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