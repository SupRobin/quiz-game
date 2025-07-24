var express = require('express');
const fs = require("fs");

var router = express.Router();

const userDBFileName = "./model/userDB.json";

router.get('/signin', function(req, res) {
    // call renderSignin method below
});

router.get('/signup', function(req, res) {
    // call renderSignup method below
});

router.post("/signin/submit", (req, res) => {
    // write the logic for to allow or disallow login of user


});

router.post("/signup/submit", (req, res) => {
    // write the logic for to allow or disallow signup of user


});

router.get('/logout', function(req, res) {
    // write the logic for to logout the user
});


function readUserDB() {
    let data = fs.readFileSync(userDBFileName, "utf-8");
    console.log(data);
    return JSON.parse(data);
}

function writeUserDB(users){
    let data = JSON.stringify(users, null, 2);
    fs.writeFileSync(userDBFileName, data, "utf-8");
}

function renderSignup(req, res, msg){
    res.render('./auth/signup', {msg: msg});
}

function renderSignin(req, res, msg){
    res.render('./auth/signin', {msg: msg});
}

function renderHome(req, res) {
    res.cookie("loggin", "true");
    res.redirect("/feed");
}
module.exports = router;