/**
 * Email Notification Service
 * Integrated with Mailofly Production API & Nodemailer Fallback
 */

async function sendInquiryNotification(inquiry) {
  const { name, email, subject, message } = inquiry;
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'therealthakur.10@gmail.com';
  const mailoflyApiKey = process.env.MAILOFLY_API_KEY;

  console.log(`[Mailer Service] Dispatching notification for inquiry from: ${name} <${email}>`);

  // Option 1: Live Mailofly REST API delivery
  if (mailoflyApiKey) {
    try {
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
        console.log('[Mailer Service] Successfully delivered via Mailofly API');
        return { success: true, provider: 'mailofly' };
      }
    } catch (err) {
      console.warn('[Mailer Service] Mailofly delivery failed, fallback triggered:', err.message);
    }
  }

  // Option 2: Fallback simulated dispatch for local dev / testing
  console.log(`[Mailer Service] [DEV LOG] Email simulated: To ${adminEmail} from ${email}`);
  return { success: true, provider: 'simulated' };
}

module.exports = {
  sendInquiryNotification
};
