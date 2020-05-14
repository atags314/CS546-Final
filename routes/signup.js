const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.users;
const healthData = data.health;
const exerciseData = data.exercise;
const bcrypt = require('bcryptjs');
const xss = require('xss');

router.get('/', async (req, res) => {
    res.render('signup');
});

router.post('/', async (req, res) => {
    const firstname = xss(req.body['firstname']);
    const lastname = xss(req.body['lastname']);
    const email = xss(req.body['email']);
    const gender = xss(req.body['gender']);
    const city = xss(req.body['city']);
    const state = xss(req.body['state']);
    const age = xss(req.body['age']);
    const username = xss(req.body['un ']);
    const password = xss(req.body['pass']);
    const comfirm = xss(req.body['pass2']);
    
    let hashedPassword;
    let usedUsername = false;
    let usedEmail = false;

    if (!firstname || !lastname || !email || !gender || !city || !state || !age || !username || !password || !comfirm) {
        res.render('signup', {
            miss: true
        });
        return;
    }

    try {
        await userData.getByUsername(username);
        usedUsername = true;
    } catch (e) {
        //console.log('This username can be used!');
    }

    try {
        await userData.getByEmail(email);
        usedEmail = true;
    } catch (e) {
        //console.log('This email can be used!');
    }

    if (usedUsername || usedEmail) {
        res.render('signup', {
            used: true
        });
        return;
    }

    if (password == comfirm) {
        hashedPassword = await bcrypt.hash(password, 15);
    } else {
        res.render('signup', {
            notComfirmed: true
        });
        return;
    }

    try {
        const user = await userData.create(firstname, lastname, username, gender, email, city, state, age, hashedPassword);
        await healthData.create(user._id);
        await exerciseData.create(user._id);
        req.session.user = {userId: user._id};
        res.redirect('/health');
    } catch (e) {
        res.render('signup');
    }
})

module.exports = router; 