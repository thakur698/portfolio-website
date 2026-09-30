const express = require('express');
const router = express.Router();
const { sendInquiryNotification } = require('../services/mailer');

/**
 * POST /api/contact
 * Handles new client inquiries and project proposals
 */
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed: name, email, and message are required fields.'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed: Invalid email address format.'
      });
    }

    const inquiryRecord = {
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      subject: subject ? String(subject).trim() : 'Project Inquiry',
      message: String(message).trim(),
      receivedAt: new Date().toISOString(),
      sourceIp: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      status: 'new'
    };

    // Store in Firestore if admin SDK is active
    let firestoreDocId = null;
    try {
      const admin = require('firebase-admin');
      if (admin.apps.length > 0) {
        const docRef = await admin.firestore().collection('inquiries').add({
          ...inquiryRecord,
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
        firestoreDocId = docRef.id;
        console.log(`[Contact Route] Inquiry written to Firestore: ${firestoreDocId}`);
      }
    } catch (dbErr) {
      console.warn('[Contact Route] Firestore write skipped (not connected):', dbErr.message);
    }

    // Trigger asynchronous notification dispatch
    sendInquiryNotification(inquiryRecord).catch(err => {
      console.error('[Contact Route] Background mail notification error:', err);
    });

    return res.status(200).json({
      success: true,
      message: 'Inquiry received successfully! Abhi will get in touch shortly.',
      id: firestoreDocId
    });

  } catch (error) {
    console.error('[Contact Route] Internal processing exception:', error);
    return res.status(500).json({
      success: false,
      error: 'An internal error occurred while processing your message.'
    });
  }
});

module.exports = router;
