require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { application } = require('express');
const app = express();
const dns = require ('dns');

let bodyParser = require ('body-parser');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use ("/", bodyParser.urlencoded ({extended: false}));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

let urls = [];

app.post ('/api/shorturl', function(req, res) {

  const url = req.body.url;
  let hostname;

  try {
    hostname = new URL(url).hostname;
  }
  catch (e) {
    res.json ({ error: 'invalid url' });
    return;
  }
  
  dns.lookup (hostname, (err, addresses, family) => {
    if (err) {
      res.json ({ error: 'invalid url' });
    } else {

      let id = urls.findIndex (e => e === url);
    
      if (id < 0) {
        id = urls.length;
        urls.push (url);
      }
    
      res.json ({"original_url":url,"short_url":id});
    }
  });
});

app.get ('/api/shorturl/:id', function(req, res) {

  id = req.params.id;

  if (id >= urls.length) {
    res.json ({"error":"No short URL found for the given input"});
  } else {
    res.redirect (urls[id]);
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
