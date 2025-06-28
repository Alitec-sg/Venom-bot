const venom = require('venom-bot');

// Function to start the Venom Bot client
async function startVenomBot() {
  try {
    const client = await venom.create(
      'myVenomRenderSession', // Unique session name. Change if deploying multiple bots.
      undefined, // Optional: Callback for QR code display (we'll rely on logs for Render)
      (statusSession, session) => {
        // Callback for session status changes
        console.log('Session Status: ', statusSession);
        console.log('Session Name: ', session);
        if (statusSession === 'isLogged') {
          console.log('Venom Bot is logged in and ready!');
        } else if (statusSession === 'notLogged') {
          console.log('Waiting for QR code scan...');
        }
      },
      {
        headless: true, // IMPORTANT: Run Chrome in headless mode (no GUI)
        devtools: false, // Disable DevTools
        use: "chromium", // Explicitly use Chromium
        browserArgs: [
          '--no-sandbox', // IMPORTANT: Required for running in Docker containers
          '--disable-setuid-sandbox', // Disable setuid sandbox
          '--disable-dev-shm-usage', // Overcomes limited /dev/shm resource problems
          '--disable-accelerated-video-decode',
          '--no-first-run',
          '--no-default-browser-check',
          '--disable-gpu',
          '--disable-extensions',
          '--disable-sync',
          '--disable-web-security',
          '--disable-features=IsolateOrigins,site-per-process',
          '--blink-settings=imagesEnabled=true'
        ],
        puppeteerOptions: {
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage' // Important for limited /dev/shm in containers
          ]
        },
        logQR: true, // Log QR code to the console (important for Render logs)
        folderNameToken: 'tokens', // Folder to store session data (make this persistent in Render)
        mkdirFolderToken: '' // Keep empty to create the folder within the project root
      }
    );

    // Your bot's message handling logic
    client.onMessage((message) => {
      console.log('Received message:', message.body);
      if (message.body && message.body.toLowerCase() === 'hi') {
        client.sendText(message.from, 'Hello from your Render-deployed Venom Bot!');
      } else if (message.body && message.body.toLowerCase() === 'status') {
        client.sendText(message.from, `I am active! My session name is ${client.getSessionName()}`);
      }
      // Add more bot logic here...
    });

    // Handle connection state changes
    client.onStateChange((state) => {
      console.log('Connection State: ', state);
      if (state === 'DISCONNECTED' || state === 'BROKEN') {
        console.log('Venom Bot disconnected. Monitor logs for re-login or issues.');
      }
    });

  } catch (error) {
    console.error('Error starting Venom Bot:', error);
    // Exit the process so Render can restart it if needed
    process.exit(1); 
  }
}

// Call the function to start the bot
startVenomBot();