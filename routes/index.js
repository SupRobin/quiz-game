const express = require('express');
const axios = require('axios');
const fs = require("fs");
const router = express.Router();
const bcrypt = require('bcrypt');
const { getQuestions } = require('../model/quizQuestions');
const {getCollection} = require("../model/db.js");

router.get('/', (req, res) => {
    res.render('main/signinandsignup');
});

router.get('/index', (req, res) => {
    res.render('main/index');
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
        
        return res.redirect('/');
    } catch (err) {
        console.error('[SIGNUP] error:', err);
        return next(err);
    }
});

router.post('/signin/submit', async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const users = getCollection('users');
        const user = await users.findOne({ email });
        
        if (user && await bcrypt.compare(password, user.password)) {
            req.session.name = user.name;
            req.session.userId = user._id;
            return res.redirect('/index');
        } else {
            return res.redirect('/?error=invalid');
        }
    } catch (err) {
        console.error('[SIGNIN] error:', err);
        return next(err);
    }
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
            name: req.session.name,
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
