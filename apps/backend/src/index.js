const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Attempt to initialize Firebase Admin SDK
try {
  const admin = require('firebase-admin');
  if (admin.apps.length === 0) {
    // If running in Cloud Functions, initializeApp() with no args auto-discovers environment credentials
    admin.initializeApp();
    console.log('[Backend] Firebase Admin SDK initialized.');
  }
} catch (err) {
  console.log('[Backend] Firebase Admin not yet initialized (waiting for credentials):', err.message);
}

const app = express();

// Middleware
app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'portfolio-backend-microservice',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Mount Routes
const contactRouter = require('./routes/contact');
const telemetryRouter = require('./routes/telemetry');

app.use('/api/contact', contactRouter);
app.use('/api/telemetry', telemetryRouter);

// Export as Firebase Cloud Function
let functionsApi = null;
try {
  const functions = require('firebase-functions');
  exports.api = functions.https.onRequest(app);
} catch (e) {
  // Not in Firebase Cloud Functions environment
}

// Local Standalone Dev Server Execution
if (require.main === module || !process.env.FUNCTION_NAME) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Portfolio Backend API running at http://localhost:${PORT}/api/health`);
  });
}

module.exports = app;
