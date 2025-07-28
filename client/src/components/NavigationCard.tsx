import React from 'react';
import { Card } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface NavigationCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  status: 'active' | 'inactive' | 'maintenance';
  onClick: () => void;
}

export const NavigationCard: React.FC<NavigationCardProps> = ({
  title,
  description,
  icon: Icon,
  status,
  onClick
}) => {
  const statusColors = {
    active: 'bg-green-500/20 border-green-500/50 text-green-400',
    inactive: 'bg-red-500/20 border-red-500/50 text-red-400',
    maintenance: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400'
  };

  const statusLabels = {
    active: 'Servizi base',
    inactive: 'Mercati finanziari',
    maintenance: 'Setup finale'
  };

  return (
    <Card 
      className="p-6 bg-card/30 backdrop-blur-sm border border-border/50 hover:border-primary/50 hover:shadow-vita-glow cursor-pointer transition-all duration-300 group"
      onClick={onClick}
    >
      <div className="flex items-start space-x-4">
        <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">{title}</h3>
            <div className={`px-2 py-1 rounded-full text-xs border ${statusColors[status]}`}>
              {statusLabels[status]}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </Card>
  );
};