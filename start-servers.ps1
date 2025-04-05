# Start-servers.ps1 - Script to start all necessary servers

# 1. Build MCP server code (Ensure TS compilation for MCP server runs)
Write-Host "Building MCP server code..."
tsc -p tsconfig.mcp.json # Explicitly build MCP server code
if ($LASTEXITCODE -ne 0) {
    Write-Error "MCP server code build failed!"
    exit 1
}

# 2. Build Frontend (Optional, if needed before starting MCP, but usually not)
# Write-Host "Building Frontend code..."
# npm run build # This builds the frontend using Vite

# 3. Start MCP server
Write-Host "Starting MCP server..."
Start-Process -NoNewWindow -PassThru -FilePath "node" -ArgumentList "local-mcp-server.mjs"

# 4. Start Vite development server
Write-Host "Starting Vite development server..."
Start-Process -NoNewWindow -PassThru -FilePath "npm" -ArgumentList "run dev"

Write-Host "All servers started!"
Write-Host "- MCP Server: http://localhost:60546"
Write-Host "- Vite Dev Server: http://localhost:5173"
Write-Host "- Supabase: (should be running separately)"
