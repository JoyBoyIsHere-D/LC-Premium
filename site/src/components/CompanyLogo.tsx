'use client';

import { useState } from 'react';
import Image from 'next/image';
import { getLogoUrl, getCompanyColor, getCompanyInitials } from '@/lib/logos';

interface CompanyLogoProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function CompanyLogo({ name, size = 'md', className = '' }: CompanyLogoProps) {
  const [hasError, setHasError] = useState(false);

  const dimensions = {
    sm: 24,
    md: 48,
    lg: 64,
  };

  const d = dimensions[size];

  if (hasError) {
    // Fallback to initials
    const color = getCompanyColor(name);
    const initials = getCompanyInitials(name);
    
    return (
      <div 
        className={`flex items-center justify-center rounded-xl font-bold shrink-0 shadow-sm border border-gray-700/50 ${className}`}
        style={{ 
          width: d, 
          height: d, 
          backgroundColor: color,
          fontSize: size === 'sm' ? '10px' : size === 'md' ? '16px' : '20px',
          color: 'white'
        }}
        title={name}
      >
        {initials}
      </div>
    );
  }

  return (
    <div 
      className={`relative shrink-0 overflow-hidden rounded-xl bg-white/5 border border-gray-700/50 p-1.5 shadow-sm ${className}`}
      style={{ width: d, height: d }}
    >
      <div className="relative w-full h-full rounded-lg overflow-hidden">
        <Image
          src={getLogoUrl(name)}
          alt={`${name} logo`}
          fill
          className="object-contain"
          onError={() => setHasError(true)}
          unoptimized
        />
      </div>
    </div>
  );
}
