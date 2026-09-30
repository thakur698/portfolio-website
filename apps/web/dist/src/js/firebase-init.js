/**
 * Firebase Client SDK Configuration & Connector
 * 
 * To connect your live Firebase project:
 * 1. Go to https://console.firebase.google.com/
 * 2. Create or select your project (e.g. 'abhi-thakur-portfolio')
 * 3. Register a Web App ('</>') and copy the firebaseConfig object below.
 * 4. Replace the placeholder values with your project credentials.
 */

const FIREBASE_CONFIG = {
  apiKey: "AIzaSy_YOUR_FIREBASE_API_KEY_HERE",
  authDomain: "abhi-thakur-portfolio.firebaseapp.com",
  projectId: "abhi-thakur-portfolio",
  storageBucket: "abhi-thakur-portfolio.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};

// State flag indicating whether production credentials have been configured
const isFirebaseConfigured = !FIREBASE_CONFIG.apiKey.includes('YOUR_FIREBASE_API_KEY');

let firebaseApp = null;
let firestoreDb = null;

// Initialize Firebase if credentials are populated and SDK is loaded
if (isFirebaseConfigured && typeof firebase !== 'undefined') {
  try {
    firebaseApp = firebase.initializeApp(FIREBASE_CONFIG);
    firestoreDb = firebase.firestore();
    console.log('[Firebase] Successfully connected to project:', FIREBASE_CONFIG.projectId);
  } catch (err) {
    console.warn('[Firebase] Initialization notice:', err.message);
  }
} else {
  console.log('[Firebase] Client ready for credentials. Configure in src/js/firebase-init.js when ready.');
}

/**
 * Universal Contact Form Dispatcher
 * Submits contact requests to Firebase Cloud Functions / Firestore, with graceful local fallback.
 * 
 * @param {Object} data - { name, email, subject, message }
 * @returns {Promise<{success: boolean, message: string}>}
 */
async function submitContactInquiry(data) {
  // Option 1: Direct Firestore Submission (if configured)
  if (firestoreDb) {
    try {
      const docRef = await firestoreDb.collection('inquiries').add({
        ...data,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        source: 'portfolio-web',
        status: 'unread'
      });
      return { success: true, message: 'Message sent successfully! Reference ID: ' + docRef.id };
    } catch (e) {
      console.error('[Firebase] Firestore write error:', e);
    }
  }

  // Option 2: Server-to-Server Cloud Function / Express API endpoint
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.ok) {
      const result = await res.json();
      return { success: true, message: result.message || 'Inquiry received!' };
    }
  } catch (e) {
    // Graceful offline fallback
    console.log('[Contact Service] Backend not currently reachable. Falling back to direct mailto.');
  }

  // Option 3: Direct mailto fallback
  const mailtoUrl = `mailto:therealthakur.10@gmail.com?subject=${encodeURIComponent(data.subject || 'Engineering Inquiry')}&body=${encodeURIComponent(`From: ${data.name} (${data.email})\n\n${data.message}`)}`;
  window.open(mailtoUrl, '_blank');
  return { success: true, message: 'Redirected to mail client.' };
}

// Export for modern ES modules or attach to window for script tags
if (typeof window !== 'undefined') {
  window.PortfolioFirebase = {
    config: FIREBASE_CONFIG,
    isConfigured: isFirebaseConfigured,
    submitInquiry: submitContactInquiry
  };
}
