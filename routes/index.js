const express = require('express');
const fs = require("fs");
const router = express.Router();
const bcrypt = require('bcrypt');
const { getQuestions } = require('../model/quizQuestions');
const {getCollection} = require("../model/db.js");

router.get('/', (req, res) => {
    res.render('main/signin');
});

router.get('/index.html', (req, res) => {
    res.render('main/index');
});

router.get('/signup', (req, res) => {
    res.render('main/signup');
});

router.post('/signup/submit', async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res
                .status(400)
                .render('main/signup', {
                    error: 'All fields are required.',
                    formData: { username, email }
                });
        }

        const usersCol = getCollection('users');
        const existing = await usersCol.findOne({ email });
        if (existing) {
            return res
                .status(409)
                .render('main/signup', {
                    error: 'That email is already in use.',
                    formData: { username, email }
                });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await usersCol.insertOne({
            username,
            email,
            password: hashedPassword
        });
        console.log('New user _id=', result.insertedId);

        return res.redirect('/signin');
    } catch (err) {
        if (err.code === 11000) {
            return res
                .status(409)
                .render('main/signup', {
                    error: 'That email is already registered.',
                    formData: { username, email }
                });
        }
        next(err);
    }
});
router.post('/quiz/submit' , function(req, res) {
    res.send("Submitting...");
})

router.get('/quizgame', (req, res) => {
    const questions = getQuestions();
    res.render('main/quizgame', { questions });
});

module.exports = router;
