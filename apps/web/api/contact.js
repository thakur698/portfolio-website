export default async function handler(req, res) {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed: name, email, and message are required fields.'
      });
    }

    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'therealthakur.10@gmail.com';
    const mailoflyApiKey = process.env.MAILOFLY_API_KEY;

    if (!mailoflyApiKey) {
      console.warn('MAILOFLY_API_KEY is not set in Vercel environment variables.');
      return res.status(500).json({ success: false, error: 'Server configuration error' });
    }

    const response = await fetch('https://api.mailofly.com/v1/emails/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${mailoflyApiKey}`
      },
      body: JSON.stringify({
        to: adminEmail,
        from: 'notifications@mailofly.com',
        subject: `[Portfolio Inquiry] ${subject || 'New Project Collaboration'}`,
        text: `New message received from portfolio website:\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        reply_to: email
      })
    });

    if (response.ok) {
      return res.status(200).json({ success: true, message: 'Inquiry received successfully!' });
    } else {
      const errorData = await response.text();
      console.error('Mailofly API Error:', errorData);
      return res.status(500).json({ success: false, error: 'Failed to dispatch email' });
    }
  } catch (error) {
    console.error('Contact API Error:', error);
    return res.status(500).json({ success: false, error: 'An internal error occurred.' });
  }
}
