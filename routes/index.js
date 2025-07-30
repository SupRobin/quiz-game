const express = require('express');
const axios = require('axios');
const fs = require("fs");
const router = express.Router();
const bcrypt = require('bcrypt');
const { getQuestions } = require('../model/quizQuestions');
const {getCollection} = require("../model/db.js");

router.get('/', (req, res) => {
    res.render('main/signin');
});

router.get('/index', (req, res) => {
    res.render('main/index');
});

router.get('/signup', (req, res) => {
    res.render('main/signup');
});
router.post('/signup/submit', async (req, res, next) => {
    const { name, email, password } = req.body;
    console.log('[SIGNUP] incoming:', { name, email });
    try {
        const users = getCollection('users');
        const hashedPassword = await bcrypt.hash(password, 10);
        const { insertedId } = await users.insertOne({
            name,
            email,
            password: hashedPassword,
        });
        console.log(`[SIGNUP] user created with _id=${insertedId}`);

        //redirect to signin page
        return res.redirect('/signin');
    } catch (err) {
        console.error('[SIGNUP] error:', err);
        return next(err);
    }
});

router.get('/signin', (req, res) => {
    res.render('main/signin');
});

router.post('/signup/submit', async (req, res, next) => {
    //verify password, username (email) is correct

    //if it is then redirect user to index
    return res.redirect('/index');
});

router.get('/quizgame', async (req, res, next) => {
    const { amount = 10, category = '', difficulty = '' } = req.query;
    const apiRes = await axios.get('https://opentdb.com/api.php', {
        params: { amount, category, difficulty }
    });
    res.render('main/quizgame', { questions: apiRes.data.results });
});

router.post('/quizgame/submit', async (req, res, next) => {
    try {
        const leaderboard = getCollection('leaderboard');

        await leaderboard.insertOne({
            name:  req.session.name,
            score: req.body.score
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
            .sort({ score: -1 })
            .limit(10)
            .toArray();

        let myBest = null, myRank = null;

        // ── check that req.session exists AND has name ──
        if (req.session && req.session.name) {
            myBest = await leaderboard
                .find({ name: req.session.name })
                .sort({ score: -1 })
                .limit(1)
                .next();

            if (myBest) {
                const better = await leaderboard.countDocuments({ score: { $gt: myBest.score } });
                myRank = better + 1;
            }
        }

        res.render('main/leaderboard', { top10, myBest, myRank });
    } catch (err) {
        next(err);
    }
});
module.exports = router;
