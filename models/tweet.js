const mongoose = require("mongoose");

const tweetSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  message: String,
  date: Date,
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  hashtags: [String],
});

const Tweet = mongoose.model("tweet", tweetSchema);

module.exports = Tweet;