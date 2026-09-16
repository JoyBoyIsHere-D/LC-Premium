'use client';

import { Building2 } from 'lucide-react';
import { getCompanyColor } from '@/lib/logos';
import iconsData from '@/lib/company-icons.json';

interface CompanyLogoProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  slug: string; // Add slug to look up the icon
}

export default function CompanyLogo({ name, slug, size = 'md', className = '' }: CompanyLogoProps) {
  const dimensions = {
    sm: 24,
    md: 48,
    lg: 64,
  };

  const iconSizes = {
    sm: 14,
    md: 24,
    lg: 32,
  };

  const d = dimensions[size];
  const iconSize = iconSizes[size];
  const color = getCompanyColor(name);

  // @ts-ignore
  const icon = iconsData[slug];

  if (icon) {
    return (
      <div 
        className={`flex items-center justify-center shrink-0 rounded-xl shadow-sm border border-gray-700/50 ${className}`}
        style={{ 
          width: d, 
          height: d, 
          backgroundColor: `#${icon.hex}20`,
          borderColor: `#${icon.hex}50`
        }}
        title={name}
      >
        <svg
          role="img"
          viewBox="0 0 24 24"
          width={iconSize}
          height={iconSize}
          xmlns="http://www.w3.org/2000/svg"
          style={{ fill: `#${icon.hex}` }}
        >
          <title>{name}</title>
          <path d={icon.path} />
        </svg>
      </div>
    );
  }

  return (
    <div 
      className={`flex items-center justify-center shrink-0 rounded-xl shadow-sm border border-gray-700/50 ${className}`}
      style={{ 
        width: d, 
        height: d, 
        backgroundColor: `${color}20`, // 20% opacity for background
        borderColor: `${color}50` // 50% opacity for border
      }}
      title={name}
    >
      <Building2 
        size={iconSize} 
        style={{ color: color }}
        strokeWidth={1.5}
      />
    </div>
  );
}
