var express = require("express");
var router = express.Router();

require("../models/connection");
const Tweet = require("../models/tweet");
const User = require("../models/user");

router.post("/add", (req, res) => {
  User.findOne({ token: req.body.token }).then((dataUser) => {
    if (dataUser) {
      const newTweet = new Tweet({
        user: dataUser.id,
        message: req.body.message,
        date: Date.now(),
        likes: [],
        hashtags: req.body.hashtags,
      });
      newTweet.save().then((newDoc) => {
        res.json({ result: true, id: newDoc});
      });
    } else {
      res.json({ result: false, error: "pas de user" });
    }
  });
});

router.get("/", (req, res) => {
  Tweet.find({})
    .populate("user")
    .then((dataTweet) => {
      const dataToSendTweets = [];
      if (dataTweet) {
        for (let e of dataTweet) {
          dataToSendTweets.push({
            //firstname: e.user.firstname,
            username: e.user.username,
            id:e.id,
            message: e.message,
            date: e.date,
            likes: e.likes,
            hashtags: e.hashtags,
          });
        }
        res.json({ result: true, data: dataToSendTweets });
      } else {
        res.json({ result: false, error: "Tweets not found" });
      }
    });
});



// router.delete("/:tweet", (req, res) => {
//   Tweet.deleteOne({ hashtags: req.params.hashtags }).then((data) => {
//     res.json({ result: true, data: data });
//   });
// });

router.delete("/:id", (req, res) => {
  Tweet.deleteOne({ _id: req.params.id })
  .then((data) => {
    if(data.deletedCount>0){
      res.json({ result: true, data: data });
    }else{
      res.json({ result: false, data: data })
    }
   });
});


router.post("/like", (req, res) => {
  Tweet.findOne({ _id: req.body.id })
    .populate("likes")
    .then((dataTweet) => {
      if (dataTweet) {
        User.findOne({ token: req.body.token }).then((dataUser) => {
          if (dataUser) {
            let newLikes = dataTweet.likes;

            if (!dataTweet.likes.some((e) => e.id === dataUser.id)) {
              newLikes.push(dataUser.id);
            } else {
              newLikes = newLikes.filter((e) => e.id !== dataUser.id);
            }

            Tweet.findOneAndUpdate(
              { _id: req.body.id },
              { $set: { likes: newLikes } }
            ).then((dataTweet) => {
              if (dataTweet) {
                res.json({ result: true ,likes:newLikes});
              } else {
                res.json({ result: false, error: "tweet pas trouvé" });
              }
            });
          } else {
            res.json({ result: false, error: "pas d'user" });
          }
        });
      } else {
        res.json({ result: false, error: "pas trouvé" });
      }
    });
});

module.exports = router;
