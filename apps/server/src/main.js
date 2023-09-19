const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  const filePath = path.join(__dirname, 'assets', 'response.json');

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Error loading response.json file');
      return;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(data);
  });
});

const port = 3000;
server.listen(port, () => console.log(`Server is running on http://localhost:${port}`));
