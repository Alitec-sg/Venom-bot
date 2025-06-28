const venom = require('venom-bot');

venom
  .create({
    session: 'session-name',
    headless: true,
    useChrome: false,
    puppeteerOptions: {
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
  })
  .then(client => {
    console.log('Venom bot started.');

    client.onMessage(message => {
      if (message.body === 'ping') {
        client.sendText(message.from, 'pong');
      }
    });
  })
  .catch(console.error);
