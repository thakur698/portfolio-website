fetch('https://api.mailofly.com/v1/emails/send', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer mf_live_xZGIuU6Ahv8btXnpiK7dwAdCXrWQd7uw'
  },
  body: JSON.stringify({
    to: 'therealthakur.10@gmail.com',
    from: 'notifications@mailofly.com',
    subject: 'Test',
    text: 'Test Message',
    reply_to: 'test@example.com'
  })
}).then(res => res.text()).then(text => console.log('Response:', text));
