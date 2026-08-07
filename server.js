import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Serve static files
app.use(express.static(__dirname));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

// Active users tracking state (real-time active sessions)
const activeSessions = new Map();

// Periodic cleanup of stale sessions (>20 seconds inactivity)
setInterval(() => {
  const now = Date.now();
  for (const [clientId, lastPing] of activeSessions.entries()) {
    if (now - lastPing > 20000) {
      activeSessions.delete(clientId);
    }
  }
}, 5000);

// API endpoint to report heartbeat and get real active user count
app.get('/api/active-users', (req, res) => {
  const clientId = req.query.clientId || req.ip || 'anonymous';
  if (clientId) {
    activeSessions.set(clientId, Date.now());
  }

  const now = Date.now();
  const realCount = Math.max(1, activeSessions.size);

  res.json({
    success: true,
    activeUsers: realCount,
    timestamp: now
  });
});

// Endpoint when tab closes or unloads
app.post('/api/active-users/leave', express.json({ type: '*/*' }), (req, res) => {
  const clientId = req.query.clientId || req.body?.clientId;
  if (clientId) {
    activeSessions.delete(clientId);
  }
  res.json({ success: true, activeUsers: activeSessions.size });
});

// Handle all requests by serving index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});

export default app;
