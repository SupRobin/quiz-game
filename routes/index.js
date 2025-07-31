const express = require('express');
const axios = require('axios');
const fs = require("fs");
const router = express.Router();
const bcrypt = require('bcrypt');
const {getQuestions} = require('../model/quizQuestions');
const {getCollection} = require("../model/db.js");

let error = ""

router.get('/', (req, res) => {
    res.render('main/signin');
});

router.get('/index', (req, res) => {
    res.render('main/index');
});

router.get('/signup', (req, res) => {
    res.render('main/signup', {error: error});
});
router.post('/signup/submit', async (req, res, next) => {
    const {name, email, password} = req.body;
    console.log('[SIGNUP] incoming:', {name, email});
    error = ""
    try {
        const users = getCollection('users');
        const hashedPassword = await bcrypt.hash(password, 10);

        if (users.findOne({email})) {
            error = "User Already Exists"
            throw new Error(error)
        }

        const {insertedId} = await users.insertOne({
            name,
            email,
            password: hashedPassword,
        });
        console.log(`[SIGNUP] user created with _id=${insertedId}`);

        //redirect to signin page
        return res.redirect('/signin');
    } catch (err) {
        console.error('[SIGNUP] error:', err);
        return res.redirect('/signup');
    }
});

router.get('/signin', (req, res) => {
    res.render('main/signin');
})

// handle the form POST
router.post('/signin/submit', async (req, res) => {
    const {email, password} = req.body;
    error = '';

    try {
        // 1) fetch your “users” collection
        const users = getCollection('users');

        // 2) look up the user by email
        const user = await users.findOne({email});
        if (!user) {
            error = 'Invalid email or password';
            return res.render('signin', {error});
        }

        // 3) compare the submitted password against the stored hash
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            error = 'Invalid email or password';
            return res.render('signin', {error});
        }

        // 4) success! render their profile (or set a session and redirect)
        req.session.userId = user._id;
        req.session.name   = user.name;
        req.session.score = user.score;
        return res.render('main/profile', {user});
    } catch (err) {
        console.error('[SIGNIN] error:', err);
        error = 'Something went wrong—please try again.';
        return res.render('signin', {error});
    }
});


router.post('/signup/submit', async (req, res, next) => {
    //verify password, username (email) is correct

    //if it is then redirect user to index
    return res.redirect('/index');
});

router.get('/quizgame', async (req, res, next) => {
    const {amount = 10, category = '', difficulty = ''} = req.query;
    const apiRes = await axios.get('https://opentdb.com/api.php', {
        params: {amount, category, difficulty}
    });
    res.render('main/quizgame', {questions: apiRes.data.results});
});

router.post('/quizgame/submit', async (req, res, next) => {
    try {
        const leaderboard = getCollection('leaderboard');
        const score = parseInt(req.body.score, 10);
        await leaderboard.insertOne({
            name: req.session.name,
            score
        });
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
});

router.get('/leaderboard', async (req, res, next) => {
    try {
        const leaderboard = getCollection('leaderboard');

        const top10 = await leaderboard.find()
            .sort({score: -1})
            .limit(10)
            .toArray();

        let myBest = null, myRank = null;

        // ── check that req.session exists AND has name ──
        if (req.session && req.session.name) {
            myBest = await leaderboard
                .find({name: req.session.name})
                .sort({score: -1})
                .limit(1)
                .next();

            if (myBest) {
                const better = await leaderboard.countDocuments({score: {$gt: myBest.score}});
                myRank = better + 1;
            }
        }

        res.render('main/leaderboard', {top10, myBest, myRank});
    } catch (err) {
        next(err);
    }
});

router.get('/logout', (req, res) => {
    // destroy their session
    req.session = null
    // clear the session cookie
    res.clearCookie('connect.sid');
    // redirect to sign-in
    res.redirect('/signin');
});


module.exports = router;
