const express = require('express');
const app = express();
app.use(express.json());

// Simple test endpoint
app.post('/mcp', async (req, res) => {
  console.log('Received request:', req.body);

  // Return a simple response
  if (req.body.path === '/auth/session') {
    // Mock session response
    const mockUser = {
      id: '123456',
      email: 'user@example.com',
      role: 'admin',
      name: 'John Doe',
      avatar: 'https://example.com/avatar.png'
    };

    const mockSession = {
      token: 'mock-jwt-token',
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };

    res.status(200).json({
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user: mockUser,
        session: mockSession
      }),
      error: null
    });
  } else if (req.body.path.startsWith('/api/voice-campaigns')) {
    // Mock voice campaigns response
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

    res.status(200).json({
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mockCampaigns),
      error: null
    });
  } else {
    // Default response
    res.status(200).json({
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'MCP server is working!' }),
      error: null
    });
  }
});

// Start server
const PORT = 60546;
app.listen(PORT, () => {
  console.log(`Test MCP Server running on http://localhost:${PORT}`);
});
