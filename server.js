const http = require('http');
const fs = require('fs');
const path = require('path');

http.createServer((req, res) => {
    const address = req.url;
    const query = new URL(address, 'http://' + req.headers.host); // Construct URL
    let filePath = '';

    // Log the request
    const logEntry = `URL: ${address}\nTimestamp: ${new Date().toString()}\n\n`;
    fs.appendFile('log.txt', logEntry, (error) => {
        if (error) {
            console.error('Error writing to log:', error);
        } else {
            console.log('Added to log.');
        }
    });

    // Determine the file to serve
    if (query.pathname.includes('documentation')) {
        filePath = path.join(__dirname, 'documentation.html');
    } else {
        filePath = path.join(__dirname, 'index.html');
    }

    // Serve the file
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        }
    });
}).listen(8000, () => {
    console.log('Flashcard test server is running on port 8000.');
});
