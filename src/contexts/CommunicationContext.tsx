import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of our context
interface CommunicationContextType {
  // Retell AI Agent settings
  retellLoading: boolean;
  retellError: string | null;
  agentStatus: Record<string, unknown> | null;
  
  // Voice campaign management
  campaigns: Campaign[];
  addCampaign: (campaign: Omit<Campaign, 'id'>) => void;
  updateCampaign: (id: string, updates: Partial<Campaign>) => void;
  deleteCampaign: (id: string) => void;
  
  // Analytics data
  analyticsData: {
    callVolume: any[];
    callOutcomes: any[];
    timeOfDay: any[];
    campaignPerformance: any[];
  };
}

// Define the Campaign type
export interface Campaign {
  id: string;
  name: string;
  type: 'recall' | 'reactivation' | 'treatment' | 'appointment' | 'event' | 'custom';
  status: 'active' | 'scheduled' | 'completed' | 'paused';
  targetCount: number;
  completedCalls: number;
  successRate: number;
  scheduledDate?: string;
  lastRun?: string;
  schedule?: {
    startDate: string;
    startTime: string;
    maxAttempts: number;
    timeBetweenAttempts: number;
  };
}

// Mock data for initial state
const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Recall Campaign - March',
    type: 'recall',
    status: 'active',
    targetCount: 150,
    completedCalls: 89,
    successRate: 45,
    lastRun: '2024-03-10'
  },
  {
    id: '2',
    name: 'Treatment Follow-up',
    type: 'treatment',
    status: 'scheduled',
    targetCount: 75,
    completedCalls: 0,
    successRate: 0,
    scheduledDate: '2024-03-20'
  }
];

// Mock analytics data
const mockAnalyticsData = {
  callVolume: [
    { date: 'Mon', completed: 45, failed: 5, answered: 35 },
    { date: 'Tue', completed: 52, failed: 3, answered: 42 },
    { date: 'Wed', completed: 48, failed: 7, answered: 38 },
    { date: 'Thu', completed: 61, failed: 4, answered: 51 },
    { date: 'Fri', completed: 55, failed: 6, answered: 45 },
    { date: 'Sat', completed: 38, failed: 2, answered: 32 },
    { date: 'Sun', completed: 42, failed: 4, answered: 35 }
  ],
  callOutcomes: [
    { name: 'Appointment Scheduled', value: 35, color: '#4BC5BD' },
    { name: 'Call Back Later', value: 25, color: '#6B4C9A' },
    { name: 'Not Interested', value: 15, color: '#C5A572' },
    { name: 'Voicemail', value: 25, color: '#1B2B5B' }
  ],
  timeOfDay: [
    { time: '8am', calls: 25 },
    { time: '10am', calls: 45 },
    { time: '12pm', calls: 35 },
    { time: '2pm', calls: 50 },
    { time: '4pm', calls: 40 },
    { time: '6pm', calls: 30 }
  ],
  campaignPerformance: [
    { name: 'Recall', success: 85, response: 65 },
    { name: 'Reactivation', success: 75, response: 55 },
    { name: 'Appointment', success: 90, response: 70 },
    { name: 'Treatment', success: 80, response: 60 },
    { name: 'Event', success: 70, response: 50 }
  ]
};

// Create the context with a default value
const CommunicationContext = createContext<CommunicationContextType | undefined>(undefined);

// Provider component
export const CommunicationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Retell AI Agent state
  const [retellLoading, setRetellLoading] = useState(false);
  const [retellError, setRetellError] = useState<string | null>(null);
  const [agentStatus, setAgentStatus] = useState<Record<string, unknown> | null>({
    voice_id: 'alloy',
    enabled: true,
    schedule: {
      after_hours: true,
      lunch_hours: true,
      holidays: true
    }
  });

  // Campaign management state
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
  
  // Analytics data state
  const [analyticsData, setAnalyticsData] = useState(mockAnalyticsData);

  // Add a new campaign
  const addCampaign = (campaign: Omit<Campaign, 'id'>) => {
    const newCampaign: Campaign = {
      ...campaign,
      id: Math.random().toString(36).substring(2, 9)
    };
    setCampaigns(prev => [...prev, newCampaign]);
  };

  // Update an existing campaign
  const updateCampaign = (id: string, updates: Partial<Campaign>) => {
    setCampaigns(prev => 
      prev.map(campaign => 
        campaign.id === id ? { ...campaign, ...updates } : campaign
      )
    );
  };

  // Delete a campaign
  const deleteCampaign = (id: string) => {
    setCampaigns(prev => prev.filter(campaign => campaign.id !== id));
  };

  // Value to be provided to consumers
  const value: CommunicationContextType = {
    retellLoading,
    retellError,
    agentStatus,
    campaigns,
    addCampaign,
    updateCampaign,
    deleteCampaign,
    analyticsData
  };

  return <CommunicationContext.Provider value={value}>{children}</CommunicationContext.Provider>;
};

// Custom hook for using the communication context
export const useCommunication = (): CommunicationContextType => {
  const context = useContext(CommunicationContext);
  if (context === undefined) {
    throw new Error('useCommunication must be used within a CommunicationProvider');
  }
  return context;
};
