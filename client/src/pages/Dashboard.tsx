import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { VitaLogo } from '@/components/VitaLogo';
import { WorldClocks } from '@/components/WorldClocks';
import { StatusPill } from '@/components/StatusPill';
import AlertsOverlay from '@/components/AlertsOverlay';
import { Button } from '@/components/ui/button';
import { LogOut, Bell } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [location, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const [alertsOpen, setAlertsOpen] = useState(false);

  const handleNavigation = (route: string) => {
    setLocation(route);
  };

  const handleLogout = () => {
    logout();
    setLocation('/login');
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
      {/* Header with user info and logout */}
      <header className="border-b border-border">
        <div className="vita-container py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <VitaLogo size="sm" showText={false} />
            <div className="text-sm text-muted-foreground">
              Welcome back, {user?.name}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAlertsOpen(true)}
              className="text-muted-foreground hover:text-foreground"
            >
              <Bell className="w-4 h-4 mr-2" />
              Alerts
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

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
          <StatusPill variant="success" onClick={() => handleNavigation('/portfolio')}>
            Portfolio Tracking
          </StatusPill>
          <StatusPill variant="info" onClick={() => handleNavigation('/analytics')}>
            Market Analytics
          </StatusPill>
          <StatusPill variant="warning" onClick={() => handleNavigation('/ai-engine')}>
            AI Trade Engine
          </StatusPill>
          <StatusPill variant="success" onClick={() => handleNavigation('/governance')}>
            Governance Panel
          </StatusPill>
          <StatusPill variant="info" onClick={() => handleNavigation('/protocol')}>
            Trading Protocol
          </StatusPill>
          <StatusPill variant="primary" onClick={() => handleNavigation('/market-data')}>
            Real-Time Data
          </StatusPill>
        </div>

        {/* Main CTA */}
        <div className="flex justify-center pt-8">
          <Button 
            size="lg" 
            className="bg-vita-gradient hover:shadow-vita-glow transition-all duration-300 px-8 py-3 text-base font-medium"
            onClick={() => handleNavigation('/communication')}
          >
            Enter Communication Hub →
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 border-t border-border bg-background/80 backdrop-blur-sm">
        <div className="vita-container py-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div>• VITA PLATFORM READY</div>
            <div>v2.4.1</div>
            <div className="flex items-center space-x-2">
              <span>Role: {user?.role}</span>
              <span>•</span>
              <span>Votes: {user?.votes}</span>
            </div>
          </div>
        </div>
      </footer>

      <AlertsOverlay 
        isOpen={alertsOpen}
        onClose={() => setAlertsOpen(false)}
      />
    </div>
  );
};

export default Dashboard;