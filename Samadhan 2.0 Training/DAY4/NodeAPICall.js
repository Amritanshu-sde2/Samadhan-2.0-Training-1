
const http = require('http');

const apiUrl = 'http://api.zippopotam.us/us/90210';

const hostname = '127.0.0.1'; 
const port = 3000;


const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');

  http.get(apiUrl, (apiRes) => {
    let rawData = '';

    apiRes.on('data', (chunk) => {
      rawData += chunk;
    });

    
    apiRes.on('end', () => {
      try {
        const parsedData = JSON.parse(rawData);
        console.log('API call successful!');
        console.log('API Response:', parsedData);

        res.end('Hello, World!\n');
      } catch (e) {
      
        console.error(`Error parsing JSON: ${e.message}`);
        res.statusCode = 500;
        res.end(`Internal Server Error: ${e.message}\n`);
      }
    });
  }).on('error', (e) => {
    console.error(`API call failed: ${e.message}`);
    res.statusCode = 500;
    res.end(`Internal Server Error: ${e.message}\n`);
  });
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
