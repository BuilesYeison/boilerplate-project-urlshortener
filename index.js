require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const URL = require('url').URL;
const dotenv = require('dotenv');
const dns = require('dns');
const ShortenURL = require('./persistence')

const { Schema } = mongoose;
dotenv.config();
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use((req, res, next) => {
  next()
}, bodyParser.urlencoded({ extended: false }))

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', async (req, res) => {
  const originalURL = req.body.url;
  const urlObject = new URL(originalURL);

  dns.lookup(urlObject.hostname, async (err, address, family) => {
    if (err) {
      res.json({
        error: "invalid url"
      });
    } else {
      var shortenedURL = Math.floor(Math.random() * 100000).toString();

      const newUrl = await ShortenURL.create({
        originalUrl: originalURL,
        shortenedUrl: shortenedURL
      });

      res.json({
        original_url: newUrl.originalUrl,
        short_url: newUrl.shortenedUrl
      });
    };
  });
})

app.get('/api/shorturl/:short_url',async (req,res)=>{
  const input = req.params.short_url
  if(!input){
    res.json({
      error: "invalid url"
    });
  }

  const urlDoc = await ShortenURL.findOne({shortenedUrl:input})

  if (!urlDoc) {
    return res.status(404).json({ error: 'Short URL not found' });
  }
  
  res.redirect(urlDoc.originalUrl);
})

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
