const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.users;
const postData = data.posts;
const healthData = data.health;
const exerciseData = data.exercise;
const groupData = data.groups;
const xss = require('xss');
const ObjectID = require('mongodb').ObjectID
router.get('/', async (req, res) => {
    let users = [];

    try {
        users = await userData.getAll();
        for (let x of users) {
            for (let i = 0; i < x.posts.length; i++) {
                x.posts[i] = await postData.get(x.posts[i]);
            }
        }
    } catch (e) {
        console.log(e);
    }

    res.render('admin', {
        users: users
    });
});

router.get('/createGroup', async (req, res) => {
    res.render('newgroup');
})

router.post('/createGroup', async (req, res) => {
    const name = xss(req.body['name']);
    const ltg = xss(req.body['ltg']);
    const announcements = xss(req.body['announcements']);

    if (!name || !ltg || !announcements) {
        res.render('newgroup', {
            miss: true
        });
        return;
    }

    try {
        await groupData.create(name, ltg, announcements);
        res.redirect('/admin');
    } catch (e) {
        res.render('newgroup');
    }
});

router.delete('/user/:id', async (req, res) => {
    try {
        const user = await userData.get(req.params.id);
        await exerciseData.remove(user._id);
        await healthData.remove(user._id);
        const group_id = user.group_id;
        if (group_id != '') {
            let uid = user._id.toHexString();
            await groupData.removeUserFromGroup(group_id, uid);
        }
        for (let x of user.posts) {
            await postData.removePost(x);
        }
        await userData.remove(req.params.id);
    } catch (e) {
        console.log(e);
    }

    res.redirect('/admin');
});

router.delete('/post/:id', async (req, res) => {
    try {
        await postData.removePost(req.params.id);
    } catch (e) {
        //console.log(e);
    }

    res.redirect('/admin');
});

module.exports = router;
