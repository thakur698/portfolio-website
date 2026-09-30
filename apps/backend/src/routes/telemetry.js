const express = require('express');
const router = express.Router();

/**
 * POST /api/telemetry
 * Logs anonymous performance telemetry (FCP, load times, scroll fps)
 */
router.post('/', async (req, res) => {
  try {
    const { metric, value, page, userAgent } = req.body;

    const payload = {
      metric: metric || 'unknown',
      value: value || null,
      page: page || 'index',
      userAgent: userAgent || req.headers['user-agent'],
      timestamp: new Date().toISOString()
    };

    // Store in Firestore if active
    try {
      const admin = require('firebase-admin');
      if (admin.apps.length > 0) {
        await admin.firestore().collection('telemetry').add({
          ...payload,
          serverTimestamp: admin.firestore.FieldValue.serverTimestamp()
        });
      }
    } catch (e) {
      // quiet fail for non-critical telemetry
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    return res.status(200).json({ received: false });
  }
});

module.exports = router;
