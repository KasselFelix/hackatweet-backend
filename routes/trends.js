var express = require("express");
var router = express.Router();

require("../models/connection");

const Trend = require("../models/trend");

router.post("/addTrend", (req, res) => {
  Trend.findOneAndUpdate(
    { hashtag: req.body.hashtag },
    { $push: { tweets: req.body.idTweet } }
  ).then((dataTrends) => {
    if (!dataTrends) {
      const newTrend = new Trend({
        hashtag: req.body.hashtag,
        tweets: [req.body.idTweet],
      });

      newTrend.save().then((newTrend) => {
        newTrend !== null
          ? res.json({ result: true })
          : res.json({ result: false });
      });
    } else {
      {
        res.json({ result: true });
      }
    }
  });
});

router.get("/allTrends", (req, res) => {
  Trend.find({}).then((dataTrends) => {
    if (dataTrends) {
      res.json({ result: true, trends: dataTrends });
    } else {
      res.json({ result: false, error: "ya pas de trends" });
    }
  });
});

module.exports = router;
