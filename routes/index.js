const express = require('express');
const fs = require("fs");
const router = express.Router();
const bcrypt = require('bcrypt');
const { getQuestions } = require('../model/quizQuestions');
const {getCollection} = require("../model/db.js");

let error = ""

router.get('/', (req, res) => {
    res.render('main/signin');
});

router.get('/index.html', (req, res) => {
    res.render('main/index');
});

router.get('/signup', (req, res) => {
    res.render('main/signup', {error: error});
});

router.get('/signin', (req, res) => {
    res.render('main/signin');
});

router.post('/signup/submit', async (req, res, next) => {
    const { name, email, password } = req.body;
    console.log('[SIGNUP] incoming:', { name, email });
    error = ""
    try {
        const users = getCollection('users');
        const hashedPassword = await bcrypt.hash(password, 10);

        if(users.findOne({email}) ) {
            error = "User Already Exists"
            throw new Error(error)
        }

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
        return res.redirect('/signup');
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
