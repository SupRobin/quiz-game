var express = require('express');
const fs = require("fs");
var router = express.Router();
const postDBFileName = "./model/postDB.json";


router.get('/', function(req, res, next) {
  
  if(req.cookies.loggin === "true") res.redirect('/feed');
  res.render('./auth/index');
});

router.get('/feed', function(req, res, next) {
  if(req.cookies.loggin === "false") res.redirect("/");
  let posts = readPostDB();
  res.render('./main/feed', {posts: posts.posts});
});

function readPostDB() {
    let data = fs.readFileSync(postDBFileName, "utf-8");
    return JSON.parse(data);
}

module.exports = router;
