import React from 'react';
import { TrendingUp, BarChart3, Users, Building2 } from 'lucide-react';

export const FeatureCards = () => {
  const features = [
    {
      icon: TrendingUp,
      title: 'Performance Tracking',
      description: 'Real-time analytics'
    },
    {
      icon: BarChart3,
      title: 'Budget Management',
      description: 'Financial oversight'
    },
    {
      icon: Users,
      title: 'Dealer Network',
      description: 'Centralized control'
    },
    {
      icon: Building2,
      title: 'Marketing Plans',
      description: 'Strategic planning'
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-4 mt-8 max-w-md">
      {features.map((feature, index) => {
        const Icon = feature.icon;
        return (
          <div
            key={index}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 hover:bg-white/15 hover:border-white/30 transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center mb-3">
              <Icon className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-white font-semibold text-sm mb-1">{feature.title}</h3>
            <p className="text-white/70 text-xs">{feature.description}</p>
          </div>
        );
      })}
    </div>
  );
};
