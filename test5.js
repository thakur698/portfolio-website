async function test() {
  const res = await fetch('https://api.mailofly.com/v1/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer mf_live_xZGIuU6Ahv8btXnpiK7dwAdCXrWQd7uw'
    },
    body: JSON.stringify({
      to: 'therealthakur.10@gmail.com',
      from: 'therealthakur.10@gmail.com',
      subject: 'Test',
      text: 'Test Message'
    })
  });
  console.log(res.status, await res.text());
}
test();
