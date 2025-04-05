import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement>;

export const Tooth: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M7 2.5c-1.333.667-2 1.5-2 2.5 0 1.5 1.5 2 1.5 3S6 9.5 6 10c-.5 2.5-.5 3.5-2 6 0 0 4.5 3 8 3s8-3 8-3c-1.5-2.5-1.5-3.5-2-6-.5-.5-.5-1.5-.5-2s-.5-1.5.5-3c.5-1 .5-1.5 0-2.5s-2-2-4-2c-1 0-3 1-3 1z"/>
  </svg>
);

export const DentistChair: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M19 5h-7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z"/>
    <path d="M2 12h8"/>
    <path d="M4 8v8"/>
    <path d="M10 8v8"/>
    <path d="M17.5 13v-3a2 2 0 0 0-2-2h-5"/>
    <path d="M16 17h-5a2 2 0 0 1-2-2v-5"/>
  </svg>
);

export const DentalCalendar: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <path d="M9 16c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
    <path d="M9 14c.6-.5 1.2-1 2.5-1 2.5 0 2.5 2 5 2 1.3 0 1.9-.5 2.5-1" />
  </svg>
);

export const DentalChart: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="2" />
    <line x1="6" y1="6" x2="6" y2="18" />
    <line x1="12" y1="6" x2="12" y2="18" />
    <line x1="18" y1="6" x2="18" y2="18" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <circle cx="6" cy="6" r="1" />
    <circle cx="12" cy="6" r="1" />
    <circle cx="18" cy="6" r="1" />
    <circle cx="6" cy="12" r="1" />
    <circle cx="18" cy="12" r="1" />
    <circle cx="6" cy="18" r="1" />
    <circle cx="12" cy="18" r="1" />
    <circle cx="18" cy="18" r="1" />
  </svg>
);

export const DentalDrill: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 18a6 6 0 0 0 6-6"/>
    <path d="M19.5 19.5 18 21"/>
    <path d="m12 20-2 2"/>
    <path d="M8 14a6 6 0 0 0 6 6"/>
    <path d="m16.37 7.66 4.34-4.35"/>
    <path d="m9 7-2 2 9 9"/>
    <path d="m9.17 13.8 1.47-1.47"/>
    <path d="M14 9c-1.3-1.34-3-2-5-2"/>
    <path d="m7 7-2.5-2.5C3.23 3.25 3 2.77 3 2.26 3 1.03 4.5.5 5.5 2l.5.5"/>
    <path d="m7.44 7.97.56.53c.76.73 2.26.75 3.05-.03.27-.27.43-.6.44-.95 0-.33-.14-.65-.38-.89L7.8 4.31c-.2-.2-.36-.4-.47-.6a1.5 1.5 0 0 1-.24-.82c0-.43.21-.81.58-1.18C8.5.88 9.79 1 10.26 1.47l3.28 3.3"/>
  </svg>
);

export const Toothbrush: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 22v-7"/>
    <path d="M8 22v-7"/>
    <path d="M12 13V6.5A2.5 2.5 0 0 0 9.5 4h0A2.5 2.5 0 0 0 7 6.5V13"/>
    <path d="M12 11H7"/>
    <path d="M10 4V2"/>
  </svg>
);

// Export all icons as a default object
const DentalIcons = {
  Tooth,
  DentistChair,
  DentalCalendar,
  DentalChart,
  DentalDrill,
  Toothbrush
};

export default DentalIcons;
