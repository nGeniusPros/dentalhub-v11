const express = require('express');
const app = express();
app.use(express.json());

// Simple test endpoint
app.post('/mcp', async (req, res) => {
  console.log('Received request:', req.body);
  
  // Return a simple response
  res.status(200).json({
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    body: { message: 'MCP server is working!' },
    error: null
  });
});

// Start server
const PORT = 60546;
app.listen(PORT, () => {
  console.log(`Test MCP Server running on http://localhost:${PORT}`);
});
