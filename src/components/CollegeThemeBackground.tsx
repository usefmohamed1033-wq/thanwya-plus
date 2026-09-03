import React from 'react';
import { DREAM_COLLEGES_DATA, DreamCollegeTheme } from '../data/collegeThemes';
import { UserProfile } from '../types';

interface CollegeThemeBackgroundProps {
  collegeId: string;
  onOpenSelector: () => void;
  currentUser?: UserProfile | null;
}

export const CollegeThemeBackground: React.FC<CollegeThemeBackgroundProps> = ({
  collegeId,
}) => {
  const theme: DreamCollegeTheme = DREAM_COLLEGES_DATA[collegeId] || DREAM_COLLEGES_DATA.medicine;

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none transition-all duration-1000">
      {/* 1. Subtle, refined ambient mesh gradient lights (Apple style) */}
      <div
        className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full blur-[140px] opacity-[0.06] dark:opacity-[0.12] transition-all duration-1000"
        style={{ backgroundColor: theme.primaryColor || '#059669' }}
      />
      <div
        className="absolute top-1/3 -left-40 w-[550px] h-[550px] rounded-full blur-[160px] opacity-[0.04] dark:opacity-[0.08] transition-all duration-1000"
        style={{ backgroundColor: theme.glowAccent || '#3b82f6' }}
      />
      <div
        className="absolute -bottom-40 right-1/3 w-[500px] h-[500px] rounded-full blur-[150px] opacity-[0.04] dark:opacity-[0.09] transition-all duration-1000"
        style={{ backgroundColor: theme.primaryColor || '#059669' }}
      />

      {/* 2. Soft micro-grid texture for subtle depth (iPadOS paper finish) */}
      <div
        className="absolute inset-0 opacity-[0.018] dark:opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}
      />
    </div>
  );
};
