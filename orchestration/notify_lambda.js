const https = require('https');

exports.handler = async (event) => {
  const service = event.detail.service.name;
  const environment = event.detail.environment.name;
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;

  const message = JSON.stringify({
    text: `✅ *${service}* successfully deployed to *${environment}* via AWS Proton!`
  });

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': message.length
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(webhookUrl, options, (res) => {
      res.on('data', d => process.stdout.write(d));
      res.on('end', () => resolve({ status: 'Notification sent' }));
    });
    req.on('error', (e) => reject(e));
    req.write(message);
    req.end();
  });
};
