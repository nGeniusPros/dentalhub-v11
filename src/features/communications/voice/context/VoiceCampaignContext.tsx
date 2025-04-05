import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useMCPRequest } from '../../../../mcp/client/MCPClient';

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

// Define the AI Agent Status type
export interface AIAgentStatus {
  enabled: boolean;
  voiceId: string;
  afterHours: boolean;
  lunchHours: boolean;
  holidays: boolean;
  customSchedule: boolean;
  schedule?: {
    monday: { start: string; end: string };
    tuesday: { start: string; end: string };
    wednesday: { start: string; end: string };
    thursday: { start: string; end: string };
    friday: { start: string; end: string };
    saturday: { start: string; end: string };
    sunday: { start: string; end: string };
  };
}

// Define the Analytics Data type
export interface AnalyticsData {
  callVolume: Array<{
    date: string;
    completed: number;
    failed: number;
    answered: number;
  }>;
  callOutcomes: Array<{
    name: string;
    value: number;
  }>;
  timeOfDay: Array<{
    hour: string;
    calls: number;
    success: number;
  }>;
  campaignPerformance: Array<{
    name: string;
    success: number;
    failure: number;
  }>;
}

// Define the context type
interface VoiceCampaignContextType {
  // Campaign management
  campaigns: Campaign[];
  addCampaign: (campaign: Omit<Campaign, 'id'>) => Promise<void>;
  updateCampaign: (id: string, updates: Partial<Campaign>) => Promise<void>;
  deleteCampaign: (id: string) => Promise<void>;
  
  // AI Agent settings
  agentStatus: AIAgentStatus | null;
  updateAgentSettings: (settings: Partial<AIAgentStatus>) => Promise<void>;
  agentLoading: boolean;
  agentError: string | null;
  
  // Analytics data
  analyticsData: AnalyticsData;
  refreshAnalytics: () => Promise<void>;
  analyticsLoading: boolean;
  analyticsError: string | null;
}

// Create the context
const VoiceCampaignContext = createContext<VoiceCampaignContextType | undefined>(undefined);

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
const mockAnalyticsData: AnalyticsData = {
  callVolume: [
    { date: 'Jan', completed: 65, failed: 28, answered: 93 },
    { date: 'Feb', completed: 59, failed: 48, answered: 107 },
    { date: 'Mar', completed: 80, failed: 40, answered: 120 },
    { date: 'Apr', completed: 81, failed: 19, answered: 100 },
    { date: 'May', completed: 56, failed: 86, answered: 142 },
    { date: 'Jun', completed: 55, failed: 27, answered: 82 },
    { date: 'Jul', completed: 40, failed: 90, answered: 130 }
  ],
  callOutcomes: [
    { name: 'Answered', value: 65 },
    { name: 'Voicemail', value: 25 },
    { name: 'No Answer', value: 10 }
  ],
  timeOfDay: [
    { hour: '9AM', calls: 30, success: 20 },
    { hour: '10AM', calls: 45, success: 35 },
    { hour: '11AM', calls: 60, success: 45 },
    { hour: '12PM', calls: 40, success: 25 },
    { hour: '1PM', calls: 30, success: 20 },
    { hour: '2PM', calls: 50, success: 40 },
    { hour: '3PM', calls: 70, success: 55 },
    { hour: '4PM', calls: 60, success: 45 },
    { hour: '5PM', calls: 40, success: 30 }
  ],
  campaignPerformance: [
    { name: 'Recall', success: 65, failure: 35 },
    { name: 'Reactivation', success: 45, failure: 55 },
    { name: 'Treatment', success: 75, failure: 25 },
    { name: 'Appointment', success: 85, failure: 15 }
  ]
};

// Provider component
export const VoiceCampaignProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // State for campaigns
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
  
  // State for AI agent
  const [agentStatus, setAgentStatus] = useState<AIAgentStatus | null>({
    enabled: true,
    voiceId: 'alloy',
    afterHours: true,
    lunchHours: true,
    holidays: true,
    customSchedule: false,
    schedule: {
      monday: { start: '17:00', end: '09:00' },
      tuesday: { start: '17:00', end: '09:00' },
      wednesday: { start: '17:00', end: '09:00' },
      thursday: { start: '17:00', end: '09:00' },
      friday: { start: '17:00', end: '09:00' },
      saturday: { start: '00:00', end: '23:59' },
      sunday: { start: '00:00', end: '23:59' }
    }
  });
  const [agentLoading, setAgentLoading] = useState(false);
  const [agentError, setAgentError] = useState<string | null>(null);
  
  // State for analytics
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>(mockAnalyticsData);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);
  
  // MCP requests
  const { execute: fetchCampaigns, loading: campaignsLoading } = useMCPRequest<Campaign[]>('/api/voice-campaigns', 'GET');
  const { execute: createCampaign } = useMCPRequest<Campaign>('/api/voice-campaigns', 'POST');
  const { execute: updateCampaignRequest } = useMCPRequest<Campaign>('/api/voice-campaigns', 'PUT');
  const { execute: deleteCampaignRequest } = useMCPRequest<void>('/api/voice-campaigns', 'DELETE');
  const { execute: fetchAgentStatus } = useMCPRequest<AIAgentStatus>('/api/voice-agent', 'GET');
  const { execute: updateAgentSettingsRequest } = useMCPRequest<AIAgentStatus>('/api/voice-agent', 'PUT');
  const { execute: fetchAnalytics } = useMCPRequest<AnalyticsData>('/api/voice-analytics', 'GET');
  
  // Fetch campaigns on mount
  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        const data = await fetchCampaigns();
        if (data) {
          setCampaigns(data);
        }
      } catch (error) {
        console.error('Error fetching campaigns:', error);
        // Fall back to mock data if API fails
      }
    };
    
    // Comment out for now until API is implemented
    // loadCampaigns();
  }, []);
  
  // Fetch agent status on mount
  useEffect(() => {
    const loadAgentStatus = async () => {
      setAgentLoading(true);
      setAgentError(null);
      try {
        const data = await fetchAgentStatus();
        if (data) {
          setAgentStatus(data);
        }
      } catch (error) {
        console.error('Error fetching agent status:', error);
        setAgentError('Failed to load AI agent status');
        // Fall back to mock data if API fails
      } finally {
        setAgentLoading(false);
      }
    };
    
    // Comment out for now until API is implemented
    // loadAgentStatus();
  }, []);
  
  // Add a new campaign
  const addCampaign = async (campaign: Omit<Campaign, 'id'>) => {
    try {
      // In a real implementation, this would call the API
      // const newCampaign = await createCampaign(campaign);
      
      // For now, create a mock campaign with a random ID
      const newCampaign: Campaign = {
        ...campaign,
        id: Math.random().toString(36).substring(2, 9)
      };
      
      setCampaigns(prev => [...prev, newCampaign]);
    } catch (error) {
      console.error('Error adding campaign:', error);
      throw error;
    }
  };
  
  // Update an existing campaign
  const updateCampaign = async (id: string, updates: Partial<Campaign>) => {
    try {
      // In a real implementation, this would call the API
      // await updateCampaignRequest({ id, ...updates });
      
      setCampaigns(prev => 
        prev.map(campaign => 
          campaign.id === id ? { ...campaign, ...updates } : campaign
        )
      );
    } catch (error) {
      console.error('Error updating campaign:', error);
      throw error;
    }
  };
  
  // Delete a campaign
  const deleteCampaign = async (id: string) => {
    try {
      // In a real implementation, this would call the API
      // await deleteCampaignRequest({ id });
      
      setCampaigns(prev => prev.filter(campaign => campaign.id !== id));
    } catch (error) {
      console.error('Error deleting campaign:', error);
      throw error;
    }
  };
  
  // Update AI agent settings
  const updateAgentSettings = async (settings: Partial<AIAgentStatus>) => {
    setAgentLoading(true);
    setAgentError(null);
    try {
      // In a real implementation, this would call the API
      // const updatedSettings = await updateAgentSettingsRequest(settings);
      
      setAgentStatus(prev => prev ? { ...prev, ...settings } : null);
    } catch (error) {
      console.error('Error updating agent settings:', error);
      setAgentError('Failed to update AI agent settings');
      throw error;
    } finally {
      setAgentLoading(false);
    }
  };
  
  // Refresh analytics data
  const refreshAnalytics = async () => {
    setAnalyticsLoading(true);
    setAnalyticsError(null);
    try {
      // In a real implementation, this would call the API
      // const data = await fetchAnalytics();
      
      // For now, just use the mock data
      setAnalyticsData(mockAnalyticsData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setAnalyticsError('Failed to load analytics data');
      throw error;
    } finally {
      setAnalyticsLoading(false);
    }
  };
  
  // Value to be provided to consumers
  const value: VoiceCampaignContextType = {
    campaigns,
    addCampaign,
    updateCampaign,
    deleteCampaign,
    agentStatus,
    updateAgentSettings,
    agentLoading,
    agentError,
    analyticsData,
    refreshAnalytics,
    analyticsLoading,
    analyticsError
  };
  
  return <VoiceCampaignContext.Provider value={value}>{children}</VoiceCampaignContext.Provider>;
};

// Custom hook for using the voice campaign context
export const useVoiceCampaign = (): VoiceCampaignContextType => {
  const context = useContext(VoiceCampaignContext);
  if (context === undefined) {
    throw new Error('useVoiceCampaign must be used within a VoiceCampaignProvider');
  }
  return context;
};
