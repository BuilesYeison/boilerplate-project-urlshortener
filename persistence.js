const dotenv = require('dotenv');
const mongoose = require('mongoose');

const { Schema } = mongoose;
dotenv.config();

mongoose.connect(process.env.MONGO_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Successfully connected to MongoDB');
});

const urlShortenerSchema = new Schema({
  originalUrl: String,
  shortenedUrl: String
});

module.exports = mongoose.model('ShortenURL', urlShortenerSchema);