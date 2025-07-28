import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Bell, TrendingUp, Calendar, FileText, BarChart3 } from 'lucide-react';
import { MOCK_ALERTS } from '@/lib/mockData';
import { Alert } from '@/lib/types';

interface AlertsOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AlertsOverlay: React.FC<AlertsOverlayProps> = ({ isOpen, onClose }) => {
  const [alerts, setAlerts] = useState<Alert[]>(MOCK_ALERTS);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const unread = alerts.filter(alert => !alert.read).length;
    setUnreadCount(unread);
  }, [alerts]);

  // Simulate new alerts
  useEffect(() => {
    const interval = setInterval(() => {
      const newAlert: Alert = {
        id: `A${Date.now()}`,
        type: ['macro', 'cot', 'news', 'technical'][Math.floor(Math.random() * 4)] as Alert['type'],
        title: 'New Market Alert',
        message: 'This is a simulated real-time alert from the VITA engine.',
        severity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as Alert['severity'],
        created_at: new Date().toISOString(),
        read: false
      };
      
      setAlerts(prev => [newAlert, ...prev].slice(0, 10)); // Keep only 10 most recent
    }, 30000); // New alert every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const markAsRead = (alertId: string) => {
    setAlerts(prev =>
      prev.map(alert =>
        alert.id === alertId ? { ...alert, read: true } : alert
      )
    );
  };

  const markAllAsRead = () => {
    setAlerts(prev => prev.map(alert => ({ ...alert, read: true })));
  };

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'macro':
        return <Calendar className="w-4 h-4" />;
      case 'cot':
        return <BarChart3 className="w-4 h-4" />;
      case 'news':
        return <FileText className="w-4 h-4" />;
      case 'technical':
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getSeverityColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
      <div className="fixed right-4 top-4 bottom-4 w-96 max-w-[calc(100vw-2rem)]">
        <Card className="vita-card h-full flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Market Alerts</h3>
              {unreadCount > 0 && (
                <Badge variant="destructive" className="h-5 px-2 text-xs">
                  {unreadCount}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs"
                >
                  Mark all read
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Alerts List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {alerts.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No alerts at the moment</p>
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    alert.read
                      ? 'bg-muted/30 border-border/50'
                      : 'bg-background border-primary/20 shadow-sm'
                  }`}
                  onClick={() => markAsRead(alert.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-1.5 rounded-full ${
                      alert.read ? 'bg-muted' : 'bg-primary/10'
                    }`}>
                      <div className={alert.read ? 'text-muted-foreground' : 'text-primary'}>
                        {getAlertIcon(alert.type)}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className={`text-sm font-medium ${
                          alert.read ? 'text-muted-foreground' : 'text-foreground'
                        }`}>
                          {alert.title}
                        </h4>
                        <Badge 
                          variant={getSeverityColor(alert.severity)}
                          className="text-xs"
                        >
                          {alert.severity}
                        </Badge>
                      </div>
                      
                      <p className={`text-xs leading-relaxed ${
                        alert.read ? 'text-muted-foreground' : 'text-foreground'
                      }`}>
                        {alert.message}
                      </p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-muted-foreground uppercase tracking-wider">
                          {alert.type}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatTime(alert.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {!alert.read && (
                    <div className="w-2 h-2 bg-primary rounded-full ml-auto mt-2"></div>
                  )}
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AlertsOverlay;