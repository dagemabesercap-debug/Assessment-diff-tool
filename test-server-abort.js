const http = require('http');

const req = http.request({
  hostname: 'localhost',
  port: 8090,
  path: '/api/portcos/grab',
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
}, (res) => {
  console.log('Got response:', res.statusCode);
});

req.write(JSON.stringify({ company_name: "test", assessments: [{code: "123", year: "2020"}] }));
req.end();

setTimeout(() => {
  console.log('Aborting request...');
  req.destroy();
}, 2000);
