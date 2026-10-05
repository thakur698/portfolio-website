async function test() {
  const urls = [
    'https://api.mailofly.com/v1/emails',
    'https://api.mailofly.com/emails',
    'https://api.mailofly.com/v1/send',
    'https://api.mailofly.com/send'
  ];

  for (const url of urls) {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer mf_live_xZGIuU6Ahv8btXnpiK7dwAdCXrWQd7uw'
      },
      body: JSON.stringify({
        to: 'therealthakur.10@gmail.com',
        from: 'notifications@mailofly.com',
        subject: 'Test',
        text: 'Test Message'
      })
    });
    console.log(url, res.status, await res.text());
  }
}
test();
