import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Mock Supabase client
const supabase = {};

// Simple adapter for voice campaigns
class VoiceCampaignAdapter {
  constructor() {
    // No need for supabase in this simplified version
  }

  async handleRequest(request) {
    const path = request.path;
    const method = request.method.toUpperCase();

    // Voice campaigns endpoints
    if (path === '/api/voice-campaigns') {
      if (method === 'GET') {
        return this.getCampaigns();
      } else if (method === 'POST') {
        return this.createCampaign(request.body);
      }
    }
    // Single campaign endpoints
    else if (path.startsWith('/api/voice-campaigns/') && path.length > 20) {
      const campaignId = path.split('/').pop() || '';

      if (method === 'GET') {
        return this.getCampaign(campaignId);
      } else if (method === 'PUT') {
        return this.updateCampaign(campaignId, request.body);
      } else if (method === 'DELETE') {
        return this.deleteCampaign(campaignId);
      }
    }
    // Voice agent settings endpoints
    else if (path === '/api/voice-agent') {
      if (method === 'GET') {
        return this.getAgentSettings();
      } else if (method === 'PUT') {
        return this.updateAgentSettings(request.body);
      }
    }
    // Voice analytics endpoints
    else if (path === '/api/voice-analytics') {
      if (method === 'GET') {
        return this.getAnalytics();
      }
    }

    return {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
      body: null,
      error: {
        code: 'NOT_FOUND',
        message: `Unsupported path or method: ${path} ${method}`,
        details: null
      }
    };
  }

  async getCampaigns() {
    try {
      // Return mock data
      const mockCampaigns = [
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

      return {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockCampaigns),
        error: null
      };
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      return {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
        body: null,
        error: {
          code: 'FETCH_ERROR',
          message: 'Failed to fetch voice campaigns',
          details: error instanceof Error ? error.message : String(error)
        }
      };
    }
  }

  async getCampaign(id) {
    try {
      // Return mock data
      const mockCampaign = {
        id,
        name: 'Recall Campaign - March',
        type: 'recall',
        status: 'active',
        targetCount: 150,
        completedCalls: 89,
        successRate: 45,
        lastRun: '2024-03-10'
      };

      return {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockCampaign),
        error: null
      };
    } catch (error) {
      console.error(`Error fetching campaign ${id}:`, error);
      return {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
        body: null,
        error: {
          code: 'FETCH_ERROR',
          message: `Failed to fetch voice campaign ${id}`,
          details: error instanceof Error ? error.message : String(error)
        }
      };
    }
  }

  async createCampaign(campaignData) {
    try {
      // Return mock data
      const mockCreatedCampaign = {
        id: Math.random().toString(36).substring(2, 9),
        ...campaignData,
        completedCalls: 0,
        successRate: 0,
        createdAt: new Date().toISOString()
      };

      return {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockCreatedCampaign),
        error: null
      };
    } catch (error) {
      console.error('Error creating campaign:', error);
      return {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
        body: null,
        error: {
          code: 'CREATE_ERROR',
          message: 'Failed to create voice campaign',
          details: error instanceof Error ? error.message : String(error)
        }
      };
    }
  }

  async updateCampaign(id, updates) {
    try {
      // Return mock data
      const mockUpdatedCampaign = {
        id,
        name: updates.name || 'Recall Campaign - March',
        type: updates.type || 'recall',
        status: updates.status || 'active',
        targetCount: updates.targetCount || 150,
        completedCalls: 89,
        successRate: 45,
        lastRun: '2024-03-10',
        updatedAt: new Date().toISOString()
      };

      return {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockUpdatedCampaign),
        error: null
      };
    } catch (error) {
      console.error(`Error updating campaign ${id}:`, error);
      return {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
        body: null,
        error: {
          code: 'UPDATE_ERROR',
          message: `Failed to update voice campaign ${id}`,
          details: error instanceof Error ? error.message : String(error)
        }
      };
    }
  }

  async deleteCampaign(id) {
    try {
      return {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: true, message: `Campaign ${id} deleted successfully` }),
        error: null
      };
    } catch (error) {
      console.error(`Error deleting campaign ${id}:`, error);
      return {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
        body: null,
        error: {
          code: 'DELETE_ERROR',
          message: `Failed to delete voice campaign ${id}`,
          details: error instanceof Error ? error.message : String(error)
        }
      };
    }
  }

  async getAgentSettings() {
    try {
      // Return mock data
      const mockAgentSettings = {
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
      };

      return {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockAgentSettings),
        error: null
      };
    } catch (error) {
      console.error('Error fetching agent settings:', error);
      return {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
        body: null,
        error: {
          code: 'FETCH_ERROR',
          message: 'Failed to fetch agent settings',
          details: error instanceof Error ? error.message : String(error)
        }
      };
    }
  }

  async updateAgentSettings(settings) {
    try {
      // Return the input settings as the updated settings
      return {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
        error: null
      };
    } catch (error) {
      console.error('Error updating agent settings:', error);
      return {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
        body: null,
        error: {
          code: 'UPDATE_ERROR',
          message: 'Failed to update agent settings',
          details: error instanceof Error ? error.message : String(error)
        }
      };
    }
  }

  async getAnalytics() {
    try {
      // Return mock data
      const mockAnalyticsData = {
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

      return {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockAnalyticsData),
        error: null
      };
    } catch (error) {
      console.error('Error fetching analytics:', error);
      return {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
        body: null,
        error: {
          code: 'FETCH_ERROR',
          message: 'Failed to fetch voice analytics',
          details: error instanceof Error ? error.message : String(error)
        }
      };
    }
  }
}

// Initialize adapter
const voiceCampaignAdapter = new VoiceCampaignAdapter();

// MCP Endpoint
app.post('/mcp', async (req, res) => {
  try {
    console.log('Received MCP request:', JSON.stringify(req.body));

    const response = await voiceCampaignAdapter.handleRequest({
      path: req.body.path,
      method: req.body.method,
      headers: req.headers,
      body: req.body.body,
      query: req.query
    });

    console.log('Sending response:', JSON.stringify(response));
    res.status(response.status).json(response);
  } catch (error) {
    console.error("Error processing MCP request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start server
const PORT = 60546;
app.listen(PORT, () => {
  console.log(`Voice Campaign Server running on http://localhost:${PORT}`);
});
