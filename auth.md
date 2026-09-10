# Agent Registration & Authentication — Auto Berlin

## Access Guidelines for Autonomous AI Agents

Auto Berlin provides open read access to its vehicle stock catalog for AI search and discovery agents.

### Public Endpoints (No Auth Required):
- **Catalog Dataset**: `https://autoberlin.vercel.app/data/vehicles.json`
- **ARD Discovery Manifest**: `https://autoberlin.vercel.app/.well-known/ai-catalog.json`
- **API Catalog**: `https://autoberlin.vercel.app/.well-known/api-catalog`
- **MCP Server Card**: `https://autoberlin.vercel.app/.well-known/mcp/server-card.json`

### Protected Administrative APIs:
- Administrative endpoints (vehicle CRUD operations) are managed via Firebase Auth session tokens for authorized staff only.
