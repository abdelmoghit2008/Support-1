const mongoose = require('mongoose');

// Connect to your MongoDB database
mongoose.connect('mongodb://localhost/your-database-name', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define the schema for blacklisted users
const blacklistSchema = new mongoose.Schema({
  userId: String, // Discord user ID
});

// Create a model for blacklisted users
const Blacklist = mongoose.model('Blacklist', blacklistSchema);

module.exports = Blacklist;
